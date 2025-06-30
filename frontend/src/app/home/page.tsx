"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../contexts/AuthContext";

interface RideOffer {
    _id: string;
    pickupLocation: string;
    dropLocation: string;
    rideDateTime: string;
    availableSeats: number;
    car: {
        model: string;
        registrationNumber: string;
        image?: string;
    };
    owner: {
        firstName: string;
        lastName: string;
    };
}

export default function RideOffersPage() {
    const { user } = useAuth();
    const [rides, setRides] = useState<RideOffer[]>([]);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState<string | null>(null);

    // useEffect(() => {
    //     const dummyRides: RideOffer[] = [
    //         {
    //             _id: "1",
    //             pickupLocation: "Nayakaman",
    //             dropLocation: "Gachibowli ORR",
    //             rideDateTime: new Date(Date.now() + 3600000).toISOString(),
    //             availableSeats: 3,
    //             car: {
    //                 model: "Hyundai i20",
    //                 registrationNumber: "MH12AB1234",
    //                 image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&h=200",
    //             },
    //             owner: {
    //                 firstName: "Rahul",
    //                 lastName: "Sharma",
    //             },
    //         },
    //         {
    //             _id: "2",
    //             pickupLocation: "Nayakaman",
    //             dropLocation: "Kokapet Exit",
    //             rideDateTime: new Date(Date.now() + 7200000).toISOString(),
    //             availableSeats: 2,
    //             car: {
    //                 model: "Honda City",
    //                 registrationNumber: "MH14CD5678",
    //                 image: "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&h=200",
    //             },
    //             owner: {
    //                 firstName: "Rakshit",
    //                 lastName: "Kulkarni",
    //             },
    //         },
    //            {
    //             _id: "2",
    //             pickupLocation: "Nayakaman",
    //             dropLocation: "Kokapet Exit",
    //             rideDateTime: new Date(Date.now() + 7200000).toISOString(),
    //             availableSeats: 2,
    //             car: {
    //                 model: "Honda City",
    //                 registrationNumber: "MH14CD5678",
    //                 image: "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&h=200",
    //             },
    //             owner: {
    //                 firstName: "Rakshit",
    //                 lastName: "Kulkarni",
    //             },
    //         },
    //            {
    //             _id: "2",
    //             pickupLocation: "Nayakaman",
    //             dropLocation: "Kokapet Exit",
    //             rideDateTime: new Date(Date.now() + 7200000).toISOString(),
    //             availableSeats: 2,
    //             car: {
    //                 model: "Honda City",
    //                 registrationNumber: "MH14CD5678",
    //                 image: "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&h=200",
    //             },
    //             owner: {
    //                 firstName: "Rakshit",
    //                 lastName: "Kulkarni",
    //             },
    //         },
    //            {
    //             _id: "2",
    //             pickupLocation: "Nayakaman",
    //             dropLocation: "Kokapet Exit",
    //             rideDateTime: new Date(Date.now() + 7200000).toISOString(),
    //             availableSeats: 2,
    //             car: {
    //                 model: "Honda City",
    //                 registrationNumber: "MH14CD5678",
    //                 image: "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&h=200",
    //             },
    //             owner: {
    //                 firstName: "Rakshit",
    //                 lastName: "Kulkarni",
    //             },
    //         },
    //            {
    //             _id: "2",
    //             pickupLocation: "Nayakaman",
    //             dropLocation: "Kokapet Exit",
    //             rideDateTime: new Date(Date.now() + 7200000).toISOString(),
    //             availableSeats: 2,
    //             car: {
    //                 model: "Honda City",
    //                 registrationNumber: "MH14CD5678",
    //                 image: "https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&h=200",
    //             },
    //             owner: {
    //                 firstName: "Rakshit",
    //                 lastName: "Kulkarni",
    //             },
    //         },
    //     ];

    //     setRides(dummyRides);
    //     setLoading(false);
    // }, []);

    const fetchRides = async () => {
        try {
            const response = await axiosInstance.get("/api/ride/active");
            setRides(response.data.data);
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

    const handleRequest = async (rideId: string) => {
        try {
            setRequesting(rideId);
            await axiosInstance.post("/api/ride/request", {
                rideId,
                userId: user?.id,
                message: "I'd like to join this ride.",
            });
            alert("Request sent!");
        } catch (err: any) {
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
        fetchRides();
    }, []);

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
                        {ride.car.image ? (
                            <img
                                src={ride.car.image}
                                alt={ride.car.model}
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
                                onClick={() => handleRequest(ride._id)}
                                disabled={requesting === ride._id}
                                className="mt-2 w-full bg-blue-900 text-white py-1.5 rounded-md text-sm hover:bg-blue-950 transition"
                            >
                                {requesting === ride._id ? "Sending..." : "Request Ride"}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
