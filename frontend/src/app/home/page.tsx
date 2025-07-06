"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../contexts/AuthContext";
import { RIDE_OFFER_STATUS } from "../utils/constants";

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
    const { user, token, isAuthenticated } = useAuth();
    const [rides, setRides] = useState<RideOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState<string | null>(null);
    const [sentRequests, setSentRequests] = useState<string[]>([]);

    const fetchRides = async () => {
        try {
            const response = await axiosInstance.post(`/api/ride?status=${RIDE_OFFER_STATUS.ACTIVE}&mode=requester`, { userId: user?.id });
            const allRides = response.data.data;
            const rideIds = response.data?.data?.map((req: any) => req._id) || [];
            setSentRequests(rideIds);
            console.log(allRides)
            const visibleRides = allRides.filter((ride: RideOffer) => {
                const userRequest = ride.requests?.[0];
                return !userRequest || userRequest.status !== "Accepted";
            });

            setRides(visibleRides);

            const sent = visibleRides
                .filter((ride: RideOffer) => ride.requests?.[0]?.status === "Sent")
                .map((ride: RideOffer) => ride._id);
            setSentRequests(sent);

            setLoading(false);
            setLoading(false);
        } catch (err: any) {
            if (err.response) {
                console.log("Error response:", err.response.data);
                alert(err.response.data.message || "Something went wrong");
            } else {
                console.log("Network or other error:", err.message);
                alert("Network error or server not reachable");
            }
        }
    };

    const sendRequest = async (rideId: string) => {
        try {
            setRequesting(rideId);
            const response = await axiosInstance.post("/api/ride/request/send", {
                rideId,
                userId: user?.id,
                message: "I'd like to join this ride.",
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setSentRequests((prev) => [...prev, rideId]);
            setRequesting(null);
        } catch (err: any) {
            setRequesting(null);
            if (err.response) {
                console.log("Error response:", err.response.data);
                alert(err.response.data.message || "Something went wrong, Failed to send request.");
            } else {
                console.log("Network or other error:", err.message);
                alert("Network error or server not reachable");
            }
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchRides();
        }
    }, [token]);

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
                                {new Date(ride.rideDateTime).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Seats:</span> {ride.availableSeats}
                            </div>

                            <button
                                onClick={() => sendRequest(ride._id)}
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
