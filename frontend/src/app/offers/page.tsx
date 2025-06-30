"use client";

import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../contexts/AuthContext";
import ScheduleRideModal from "../Modals/ScheduleRideModal";

const filterOptions = ["All", "Active", "Completed"];

export default function MyOffersPage() {
    const { token, user, isAuthenticated } = useAuth();
    const [offers, setOffers] = useState<any[]>([]);
    const [filteredOffers, setFilteredOffers] = useState<any[]>([]);
    const [filter, setFilter] = useState("Active");
    const [loading, setLoading] = useState(true);


    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await axiosInstance.get("/api/ride/active", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOffers(response.data.data || []);
                setFilteredOffers(response.data.data || []);
            } catch (err: any) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if(isAuthenticated){
            fetchOffers();
        }
    }, [isAuthenticated,token]);

    useEffect(() => {
        if (filter === "All") {
            setFilteredOffers(offers);
        } else {
            const lower = filter.toLowerCase();
            setFilteredOffers(offers.filter((offer) => offer.status === lower));
        }
    }, [filter, offers]);

    const handleCreateOffer = () => setShowModal(true);

    const handleSubmitRide = async (formData: any) => {
        try {
            await axiosInstance.post("/api/ride/create", {...formData, vehicleId: user?.vehicleId}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Ride scheduled!");
            setShowModal(false);
        } catch (err: any) {
            console.error(err);
            alert("Failed to schedule ride");
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
                <p className="text-center text-gray-500 mt-6">Loading offers...</p>
            ) : filteredOffers.length === 0 ? (
                <p className="text-center text-gray-500 mt-6">No offers found.</p>
            ) : (
                <div className="space-y-4 p-4">
                    {filteredOffers.map((offer) => (
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

            {showModal && (
                <ScheduleRideModal
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSubmitRide}
                />
            )}
        </div>

    );
}
