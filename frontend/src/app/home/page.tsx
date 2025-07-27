"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../contexts/AuthContext";
import { RIDE_OFFER_STATUS } from "../utils/constants";
import { useRouter } from "next/navigation";

interface RideOffer {
    _id: string;
    pickupLocation: string;
    dropLocation: string;
    rideDateTime: string;
    availableSeats: number;
    vehicle: {
        model: string;
        registrationNumber: string;
        image: string;
    };
    owner: {
        firstName: string;
        lastName: string;
    };
    requests?: { status: string }[];
}

export default function RideOffersPage() {
    const router = useRouter();
    const { user, token, isAuthenticated, logout } = useAuth();
    const [rides, setRides] = useState<RideOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState<string | null>(null);
    const [sentRequests, setSentRequests] = useState<string[]>([]);

    const fetchRides = async () => {
        try {
            const response = await axiosInstance.post(`/api/ride?status=${RIDE_OFFER_STATUS.ACTIVE}&mode=requester`, { userId: user?.id });
            const allRides = response.data.data || [];

            // Only fetch user requests if we have a token
            let userRequests = [];
            let requestedRideIds = new Set();

            if (token) {
                try {
                    // Get user's requests to filter out rides
                    const requestsResponse = await axiosInstance.post('/api/ride/requests',
                        { userId: user?.id },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );

                    userRequests = requestsResponse.data.data || [];
                    requestedRideIds = new Set(userRequests.map((req: any) =>
                        req.rideOffer._id || req.rideOffer
                    ));
                } catch (requestError) {
                    console.error('Error fetching ride requests:', requestError);
                    // Continue with empty requests list
                }
            } else {
                console.warn('Token is undefined, skipping authenticated requests');
            }

            // Filter rides that the user hasn't requested
            const availableRides = allRides.filter((ride: RideOffer) =>
                !requestedRideIds.has(ride._id)
            );

            setRides(availableRides);

            // Update sent requests state
            if (userRequests.length > 0) {
                try {
                    const sentRequestIds = userRequests
                        .filter((req: any) => req.status === 'Sent')
                        .map((req: any) => req.rideOffer._id || req.rideOffer);

                    setSentRequests(sentRequestIds);
                } catch (error) {
                    console.error('Error processing sent requests:', error);
                    setSentRequests([]);
                }
            }
        } catch (err: any) {
            // Check for authentication errors
            if (err.response?.status === 401 || err.response?.status === 403) {
                console.log('Session expired, redirecting to login');
                logout();
                router.replace('/login');
                return;
            }

            if (err.response) {
                console.log("Error response:", err.response.data);
                alert(err.response.data.message || "Something went wrong");
            } else {
                console.log("Network or other error:", err.message);
                alert("Network error or server not reachable");
            }
        }
        finally {
            setLoading(false);
        }
    };

    const sendRequest = async (rideId: string) => {
        try {
            setRequesting(rideId);

            // Check if token exists before making authenticated request
            if (!token) {
                console.error('Cannot send request: No authentication token');
                alert('Please log in to send ride requests');
                router.replace('/login');
                return;
            }

            try {
                const response = await axiosInstance.post("/api/ride/request/send", {
                    rideId,
                    userId: user?.id,
                    message: "I'd like to join this ride.",
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Add to sent requests
                setSentRequests((prev) => [...prev, rideId]);

                // Remove from available rides list
                setRides((prevRides) => prevRides.filter(ride => ride._id !== rideId));
            } catch (err: any) {
                // Check for authentication errors
                if (err.response?.status === 401 || err.response?.status === 403) {
                    console.log('Session expired, redirecting to login');
                    logout();
                    router.replace('/login');
                    return;
                }

                if (err.response) {
                    console.log("Error response:", err.response.data);
                    alert(err.response.data.message || "Something went wrong, Failed to send request.");
                } else {
                    console.log("Network or other error:", err.message);
                    alert("Network error or server not reachable");
                }
            }
        } catch (error) {
            console.error("Error handling the error:", error);
            alert("An unexpected error occurred");
        } finally {
            setRequesting(null);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchRides();
        } else if (token) {
            const timer = setTimeout(() => {
                fetchRides();
            }, 300);
            return () => clearTimeout(timer);
        } else {
            router.replace('/login');
        }
    }, [isAuthenticated, token]);

    if (loading) return <p className="text-center mt-10 text-gray-500">Loading rides...</p>;

    return (
        <div className="px-4 py-3 max-w-lg mx-auto space-y-5">
            <h1 className="text-2xl font-semibold text-blue-900 text-center">Available Rides</h1>

            {rides.length === 0 ? (
                <p className="text-center text-gray-500">No active rides found.</p>
            ) : (
                rides.map((ride) => (
                    <div
                        key={ride._id}
                        className="bg-white rounded-xl shadow-md border border-gray-200 p-3 flex items-start gap-4"
                    >
                        {ride.vehicle.image ? (
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}/api/image/files/${ride.vehicle.image}`}
                                alt={ride.vehicle.model}
                                className="w-20 h-20 rounded-lg object-cover shadow-sm"
                            />
                        ) : (
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                                No Image
                            </div>
                        )}

                        <div className="flex-1">
                            <div className="font-semibold text-blue-900 text-sm mb-1">
                                {ride.owner.firstName} {ride.owner.lastName}
                            </div>

                            <div className="text-sm text-gray-800">
                                <span className="font-medium">From:</span> {ride.pickupLocation}
                            </div>
                            <div className="text-sm text-gray-800">
                                <span className="font-medium">To:</span> {ride.dropLocation}
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Time:</span>{" "}
                                {(() => {
                                    try {
                                        return new Date(ride.rideDateTime).toLocaleString();
                                    } catch (error) {
                                        console.error("Error formatting date:", error);
                                        return "Invalid date";
                                    }
                                })()}
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Seats:</span> {ride.availableSeats}
                            </div>

                            <button
                                onClick={() => {
                                    try {
                                        sendRequest(ride._id);
                                    } catch (error) {
                                        console.error("Error sending request:", error);
                                        alert("Failed to send request. Please try again.");
                                    }
                                }}
                                className={`mt-2 w-full py-1.5 rounded-md text-sm transition cursor-pointer 
    ${requesting === ride._id || sentRequests.includes(ride._id)
                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                        : "bg-[#0b2345] text-white hover:bg-blue-950"
                                    }`}
                                disabled={requesting === ride._id || sentRequests.includes(ride._id)}
                            >
                                {requesting === ride._id
                                    ? "Sending..."
                                    : sentRequests.includes(ride._id)
                                        ? "Request Sent"
                                        : "Request Ride"}
                            </button>

                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
