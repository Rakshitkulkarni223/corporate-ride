"use client";

import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../contexts/AuthContext";

const filterOptions = ["Sent", "Accepted", "Rejected"];

export default function RequestsPage() {
    const { token, user, isAuthenticated } = useAuth();
    const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
    const [filter, setFilter] = useState("Sent");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axiosInstance.post(`/api/ride/requests?status=${filter}`, { userId: user?.id }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFilteredRequests(response.data.data || []);
            } catch (err: any) {
                if (err.response) {
                    console.log("Error response:", err.response.data);
                    alert(err.response.data.message || "Something went wrong");
                } else {
                    console.log("Network or other error:", err.message);
                    alert("Network error or server not reachable");
                }
            } finally {
                setLoading(false);
            }
        };
        if (isAuthenticated) {
            fetchRequests();
        }
    }, [isAuthenticated, token, filter]);

    return (
        <div className="max-w-lg mx-auto min-h-screen bg-[#f9fafb] space-y-4">
            <div className="sticky top-[2rem] z-20 bg-[#ebedef] border-b p-4 border-gray-200 pt-5 pb-3 space-y-3 backdrop-blur-sm">

                <div className="flex justify-start gap-2">
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

            {loading ? (
                <p className="text-center text-gray-500 mt-6">Loading requests...</p>
            ) : filteredRequests.length === 0 ? (
                <p className="text-center text-gray-500 mt-6">No Requests found.</p>
            ) : (
                <div className="space-y-4 p-4">
                    {filteredRequests.map((offer) => (
                        <div
                            key={offer._id}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-1"
                        >
                            <div className="flex justify-between items-center">
                                <div className="font-medium text-gray-900">
                                    {offer.pickupLocation} → {offer.dropLocation}
                                </div>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full capitalize ${offer.status === "active"
                                        ? "bg-green-100 text-green-700"
                                        : offer.status === "completed"
                                            ? "bg-gray-200 text-gray-600"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {offer.status}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600">
                                {new Date(offer.rideDateTime).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">Seats: {offer.availableSeats}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>

    );
}
