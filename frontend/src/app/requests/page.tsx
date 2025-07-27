"use client";

import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../contexts/AuthContext";
import { RIDE_OFFER_STATUS, RIDE_REQUEST_STATUS } from "../utils/constants";
import { useRouter } from "next/navigation";

const filterOptions = ["Sent", "Accepted", "Rejected"];

export default function RequestsPage() {
    const router = useRouter();
    const { token, user, isAuthenticated, logout } = useAuth();
    const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
    const [filter, setFilter] = useState("Sent");
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState<string | null>(null);

    const [selectedOwner, setSelectedOwner] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);

    const fetchRequests = async () => {
        try {
            try {
                const response = await axiosInstance.post(`/api/ride/requests?status=${filter}`, { userId: user?.id }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFilteredRequests(response.data.data || []);
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
        } catch (error) {
            console.error("Error handling the error:", error);
            alert("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    const cancelRequest = async (requestId: string) => {
        try {
            setCancelling(requestId);
            
            try {
                // Call the API to cancel the request
                await axiosInstance.post(
                    `/api/ride/request/${requestId}/respond`, 
                    { userId: user?.id, status: RIDE_REQUEST_STATUS.REJECTED },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                
                // Remove the request from the list
                setFilteredRequests(prev => prev.filter(req => req._id !== requestId));
                alert("Request cancelled successfully");
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
                    alert(err.response.data.message || "Failed to cancel request");
                } else {
                    console.log("Network or other error:", err.message);
                    alert("Network error or server not reachable");
                }
            }
        } catch (error) {
            console.error("Error handling the error:", error);
            alert("An unexpected error occurred");
        } finally {
            setCancelling(null);
        }
    };

    useEffect(() => {
        try {
            // Only fetch requests if authenticated
            if (isAuthenticated) {
                fetchRequests();
            } else if (!token) {
                // Only redirect if there's no token at all
                router.replace('/login');
            }
        } catch (error) {
            console.error("Error in useEffect:", error);
        }
    }, [isAuthenticated, token, filter]);

    return (
        <div className="max-w-lg mx-auto min-h-screen bg-[#f9fafb] space-y-4">
            <div className="sticky top-[2rem] z-20 bg-[#ebedef] border-b p-4 border-gray-200 pt-5 pb-3 space-y-3 backdrop-blur-sm">
                <h1 className="text-xl font-semibold text-blue-900 text-center mb-2">My Requests</h1>
                <div className="flex justify-center gap-2">
                    {filterOptions.map((option) => (
                        <button
                            key={option}
                            onClick={() => setFilter(option)}
                            className={`px-4 py-1.5 cursor-pointer rounded-full text-xs font-medium border transition ${filter === option
                                ? "bg-blue-100 text-blue-900 border-blue-300"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

            {showModal && selectedOwner && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm space-y-4 relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl transition"
                        >
                            ✕
                        </button>
                        <h2 className="text-lg font-semibold text-gray-800 text-center">Owner Details</h2>
                        <div className="text-sm text-gray-700 space-y-2">
                            <p><span className="font-medium">Name:</span> {selectedOwner.firstName} {selectedOwner.lastName}</p>
                            <p><span className="font-medium">Email:</span> {selectedOwner.email}</p>
                            <p><span className="font-medium">Mobile:</span> {selectedOwner.mobileNumber}</p>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <p className="text-center text-gray-500 mt-6">Loading requests...</p>
            ) : filteredRequests.length === 0 ? (
                <p className="text-center text-gray-500 mt-6">No {filter.toLowerCase()} requests found.</p>
            ) : (
                <div className="space-y-4 p-4">
                    {filteredRequests.map((request) => (
                        <div
                            key={request._id}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-1"
                        >
                            <div className="flex justify-between items-center">
                                <div className="font-medium text-gray-900">
                                    {request.rideOffer.pickupLocation} → {request.rideOffer.dropLocation}
                                </div>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full ${request.status === "Sent"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : request.status === "Accepted"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {request.status}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600">
                                {(() => {
                                    try {
                                        return new Date(request.rideOffer.rideDateTime).toLocaleString();
                                    } catch (error) {
                                        console.error("Error formatting date:", error);
                                        return "Invalid date";
                                    }
                                })()}
                            </div>
                            <div className="text-sm text-gray-500">Seats: {request.rideOffer.availableSeats}</div>
                            
                            <div className="flex mt-2 gap-2">
                                <button
                                    onClick={() => {
                                        try {
                                            setSelectedOwner(request.rideOffer.owner);
                                            setShowModal(true);
                                        } catch (error) {
                                            console.error("Error showing owner details:", error);
                                            alert("Failed to show owner details. Please try again.");
                                        }
                                    }}
                                    className="flex-1 bg-blue-100 text-blue-900 py-1.5 rounded-md text-sm hover:bg-blue-200 transition"
                                >
                                    View Owner Details
                                </button>
                                
                                {request.status === "Sent" && (
                                    <button
                                        onClick={() => {
                                            try {
                                                cancelRequest(request._id);
                                            } catch (error) {
                                                console.error("Error cancelling request:", error);
                                                alert("Failed to cancel request. Please try again.");
                                            }
                                        }}
                                        disabled={cancelling === request._id}
                                        className={`flex-1 py-1.5 rounded-md text-sm transition ${
                                            cancelling === request._id 
                                            ? "bg-gray-300 text-gray-600 cursor-not-allowed" 
                                            : "bg-red-100 text-red-900 hover:bg-red-200"
                                        }`}
                                    >
                                        {cancelling === request._id ? "Cancelling..." : "Cancel Request"}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
