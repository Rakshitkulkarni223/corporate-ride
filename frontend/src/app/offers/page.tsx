"use client";

import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../contexts/AuthContext";
import ScheduleRideModal from "../Modals/ScheduleRideModal";
import DocumentUploadModal from "../Modals/DocumentUploadModal";
import { useRouter } from "next/navigation";

const filterOptions = ["Active", "Completed", "All"];

interface RideOfferDetails {
    _id: string;
    pickupLocation: string;
    dropLocation: string;
    rideDateTime: string;
    availableSeats: number;
    status: string
}

export default function MyOffersPage() {
    const router = useRouter();

    const { token, user, isAuthenticated, updateUser } = useAuth();

    const [filteredOffers, setFilteredOffers] = useState<RideOfferDetails[]>([]);
    const [status, setStatus] = useState("Active");
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [showDocumentModal, setShowDocumentModal] = useState(false);

    const fetchOffers = async () => {
        try {
            const response = await axiosInstance.post(`/api/ride?status=${status}&mode=offerer`, { userId: user?.id });
            setFilteredOffers(response.data.data || []);
        } catch (err: any) {
            if (err.response) {
                alert(err.response.data.message || "Something went wrong");
            } else {
                alert("Network error or server not reachable");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchOffers();
        } else if (!token) {
            router.replace('/login');
        }
    }, [isAuthenticated, token, status]);

    const handleCreateOffer = async () => {
        try {
            if (!user?.documentsUploaded) {
                alert("Please upload office ID card and personal ID card");
                setShowDocumentModal(true);
                return;
            }
            setShowModal(true);
        } catch (error) {
            console.error("Error in handleCreateOffer:", error);
            alert("Something went wrong. Please try again.");
        }
    }

    const handleSubmitRide = async (formData: any) => {
        try {
            try {
                await axiosInstance.post("/api/ride/create", { ...formData, vehicleId: user?.vehicleId }, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Ride scheduled!");
                setShowModal(false);
                await fetchOffers();
            } catch (err: any) {
                if (err.response) {
                    console.log("Error response:", err.response.data);
                    alert(err.response.data.message || "Something went wrong");
                } else {
                    console.log("Network or other error:", err.message);
                    alert("Network error or server not reachable");
                }
            }
        } catch (error) {
            alert("An unexpected error occurred");
        }
    };


    const handleCardClick = (rideId: string) => {
        try {
            router.push(`/offers/${rideId}/requests`);
        } catch (error) {
            alert("Failed to navigate to requests. Please try again.");
        }
    };


    return (
        <div className="max-w-lg mx-auto min-h-screen bg-[#f9fafb] space-y-4">
            <div className="sticky top-[2rem] z-20 bg-[#ebedef] border-b p-4 border-gray-200 pt-5 pb-3 space-y-3 backdrop-blur-sm">
                <div className="flex justify-end">
                    <button
                        onClick={handleCreateOffer}
                        className="px-3 py-1 cursor-pointer rounded-xl bg-gray-100 text-blue-900 text-sm font-semibold shadow-md border border-gray-200 hover:bg-blue-50 hover:shadow-lg active:scale-95 transition-all duration-200"
                    >
                        + Schedule Ride
                    </button>
                </div>

                <div className="flex justify-start gap-2">
                    {filterOptions.map((option) => (
                        <button
                            key={option}
                            onClick={() => setStatus(option)}
                            className={`px-4 py-1.5 cursor-pointer rounded-full text-xs font-medium border transition ${status === option
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
                <p className="text-center text-gray-500 mt-6">Loading offers...</p>
            ) : filteredOffers.length === 0 ? (
                <p className="text-center text-gray-500 mt-6">No offers found.</p>
            ) : (
                <div className="space-y-4 p-4">
                    {filteredOffers.map((offer) => (
                        <div
                            key={offer._id}
                            onClick={() => handleCardClick(offer._id)}
                            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-1 cursor-pointer hover:shadow-md transition"
                        >
                            <div className="flex justify-between items-center">
                                <div className="font-medium text-gray-900">
                                    {offer.pickupLocation} → {offer.dropLocation}
                                </div>
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full capitalize ${offer?.status === "Active"
                                        ? "bg-green-100 text-green-700"
                                        : offer?.status === "Completed"
                                            ? "bg-gray-200 text-gray-600"
                                            : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {offer?.status}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600">
                                {(() => {
                                    try {
                                        return new Date(offer.rideDateTime).toLocaleString();
                                    } catch (error) {
                                        console.error("Error formatting date:", error);
                                        return "Invalid date";
                                    }
                                })()}
                            </div>
                            <div className="text-sm text-gray-500">Seats: {offer.availableSeats}</div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <ScheduleRideModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmitRide}
                />
            )}
            {showDocumentModal && user?.id && token && (
                <DocumentUploadModal
                    onClose={() => setShowDocumentModal(false)}
                    onSuccess={() => {
                        setShowDocumentModal(false);
                        updateUser({documentsUploaded: true})
                        setShowModal(true); // Show schedule modal after document upload
                    }}
                    userId={user.id}
                    token={token}
                />
            )}
        </div>

    );
}
