"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import { useRouter } from "next/navigation";

function VehicleModal({ onClose, onSave }: { onClose: () => void; onSave: (data: any) => void }) {
    const [model, setModel] = useState("");
    const [number, setNumber] = useState("");
    const [image, setImage] = useState("");

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (!model || !number) {
            alert("Model and number are required");
            return;
        }
        onSave({ model, number, image });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Add Vehicle Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Model</label>
                        <input
                            type="text"
                            className="mt-1 w-full border p-2 rounded-md"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Registration Number</label>
                        <input
                            type="text"
                            className="mt-1 w-full border p-2 rounded-md uppercase"
                            value={number}
                            onChange={(e) => setNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Image URL (optional)</label>
                        <input
                            type="text"
                            className="mt-1 w-full border p-2 rounded-md"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-1 text-sm rounded-md bg-gray-200">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-1 text-sm rounded-md bg-blue-600 text-white">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const { user: authUser, token, isAuthenticated } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isVehicleExisst, setIsVehicleExisst] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axiosInstance.get(`/api/user/profile/${authUser?.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data.data.vehicle) {
                    setIsVehicleExisst(true);
                }
                setUser(response.data.data);
            } catch (err: any) {
                if (err.response) {
                    console.log("Error response:", err.response.data);
                    alert(err.response.data.message || "Something went wrong, Failed to load profile");
                } else {
                    console.log("Network or other error:", err.message);
                    alert("Network error or server not reachable");
                }
            }
            finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchUserProfile();
        }
    }, [isAuthenticated]);

    const handleSaveVehicle = async (data: any) => {
        try {
            const response = await axiosInstance.post("/api/vehicle/create", data, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setShowModal(false);
            handleToggleRideOffer();
        } catch (err: any) {
            if (err.response) {
                console.log("Error response:", err.response.data);
                alert(err.response.data.message || "Something went wrong, Failed to save vehicle");
            } else {
                console.log("Network or other error:", err.message);
                alert("Network error or server not reachable");
            }
        }
    };

    const handleToggleRideOffer = async () => {
        const newValue = !user.isOfferingRides;
        try {
            const response = await axiosInstance.put(
                `/api/user/toggle-offering/${authUser?.id}`,
                { isOfferingRides: newValue },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setUser((prev: any) => ({ ...prev, isOfferingRides: newValue }));
            if (newValue && !isVehicleExisst) {
                setShowModal(true);
            }
            alert(response.data.message);
        } catch (err: any) {
            if (err.response) {
                console.log("Error response:", err.response.data);
                alert(err.response.data.message || "Something went wrong, Failed to toggle ride offering");
            } else {
                console.log("Network or other error:", err.message);
                alert("Network error or server not reachable");
            }
        }

    };

    if (loading) {
        return <p className="p-4 text-center mt-10 text-gray-500">Loading profile...</p>;
    }

    if (!user) {
        return <p className="p-4 text-center mt-10 text-red-500">Profile not found</p>;
    }

    return (
        <div className="p-4 max-w-lg mx-auto space-y-4 bg-[#f0f2f5] min-h-screen">
            <div className="flex items-center justify-between pb-2 border-gray-300">
                <h1 className="text-xl font-bold text-gray-800">Profile</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                {user.profile?.avatar ? (
                    <img
                        src={`/files/${user.profile.avatar}`}
                        alt="avatar"
                        className="w-16 h-16 rounded-full object-cover border"
                    />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                        No Avatar
                    </div>
                )}
                <div className="space-y-1 text-sm text-gray-800">
                    <div className="font-medium text-base">
                        {user.firstName} {user.lastName}
                    </div>
                    <div className="text-gray-600">{user.email}</div>
                    <div className="text-gray-600">📞 {user.mobileNumber}</div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 space-y-2 text-sm text-gray-800">
                <div>
                    <strong>Age:</strong> {user.profile?.age || "-"}
                </div>
                <div>
                    <strong>Gender:</strong> {user.profile?.gender || "-"}
                </div>
                <div>
                    <strong>Home:</strong> {user.profile?.homeAddress || "-"}
                </div>
                <div>
                    <strong>Office:</strong> {user.profile?.officeAddress || "-"}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                <div className="text-sm font-medium text-gray-800">Offering Rides</div>
                <button
                    onClick={handleToggleRideOffer}
                    className={`px-4 py-1.5 text-sm font-medium rounded-full shadow-sm transition cursor-pointer 
                    ${user.isOfferingRides ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                >
                    {user.isOfferingRides ? "Enabled" : "Disabled"}
                </button>
            </div>

            {/* {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
                        <h2 className="text-lg font-semibold text-gray-800 mb-2">Vehicle Required</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            To start offering rides, you must first register a vehicle.
                        </p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-3 py-1.5 text-sm rounded-md bg-gray-100 text-gray-700"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleGoToVehicleForm}
                                className="px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white"
                            >
                                Add Vehicle
                            </button>
                        </div>
                    </div>
                </div>
            )} */}

            {showModal && (
                <VehicleModal
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveVehicle}
                />
            )}
        </div>
    );
}
