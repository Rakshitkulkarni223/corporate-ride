"use client";

import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../contexts/AuthContext";
import { RIDE_OFFER_STATUS } from "../utils/constants";

const filterOptions = ["Sent", "Accepted", "Rejected"];

export default function RequestsPage() {
    const { token, user, isAuthenticated } = useAuth();
    const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
    const [filter, setFilter] = useState("Sent");
    const [loading, setLoading] = useState(true);

    const [selectedOwner, setSelectedOwner] = useState<any | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axiosInstance.post(`/api/ride/requests?status=${filter}`, { userId: user?.id }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFilteredRequests(response.data.data || []);
                console.log(response.data.data)
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
                                    {offer.rideOffer.pickupLocation} → {offer.rideOffer.dropLocation}
                                </div>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full capitalize ${offer.status === RIDE_OFFER_STATUS.ACTIVE
                                        ? "bg-green-100 text-green-700"
                                        : offer.status === RIDE_OFFER_STATUS.COMPLETED
                                            ? "bg-gray-200 text-gray-600"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {offer.status}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600">
                                {new Date(offer.rideOffer.rideDateTime).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">Seats: {offer.rideOffer.availableSeats}</div>
                            <button
                                onClick={() => {
                                    setSelectedOwner(offer.rideOffer.owner);
                                    setShowModal(true);
                                }}
                                className="mt-2 w-full bg-blue-100 text-blue-900 py-1.5 rounded-md text-sm hover:bg-blue-200 transition"
                            >
                                View Owner Details
                            </button>

                        </div>
                    ))}
                </div>
            )}
        </div>

    );
}
