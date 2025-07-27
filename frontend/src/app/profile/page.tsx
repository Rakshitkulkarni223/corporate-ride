"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import VehicleModal from "../Modals/VehicleModal";
import { RiPencilLine } from "react-icons/ri";
import { useRouter } from "next/navigation";
import AvatarUploadModal from "../Modals/AvatarUploadModal";

export default function ProfilePage() {
    const router = useRouter();
    const { user: authUser, token, isAuthenticated, updateUser, logout } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [isVehicleExisst, setIsVehicleExisst] = useState(false);
    const [vehicle, setVehicle] = useState<any>(null);

    const [isOfferingRides, setIsOfferingRides] = useState(false);

    const fetchUserProfile = async () => {
        try {
            try {
                const response = await axiosInstance.get(`/api/user/profile/${authUser?.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = response.data.data;
                setUser(data);
                if (data.vehicle) {
                    setIsVehicleExisst(true);
                }
                setIsOfferingRides(data.isOfferingRides)
                updateUser({ isOfferingRides: data.isOfferingRides });
            } catch (err: any) {
                // Check if it's an authentication error
                if (err.response?.status === 401 || err.response?.status === 403) {
                    console.log('Session expired, redirecting to login');
                    logout();
                    router.replace('/login');
                    return;
                }

                if (err.response) {
                    console.log("Error response:", err.response.data);
                    alert(err.response.data.message || "Something went wrong, Failed to load profile");
                } else {
                    console.log("Network or other error:", err.message);
                    alert("Network error or server not reachable");
                }
            }
        } catch (error) {
            console.error("Error in fetchUserProfile:", error);
            alert("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserProfile();
        } else if (!token) {
            router.replace('/login');
        }
    }, [isAuthenticated]);

    const fetchVehicleDetails = async (isOfferingRides: boolean) => {
        try {
            debugger
            if (!isOfferingRides) {
                setVehicle(null);
                return;
            }

            try {
                const response = await axiosInstance.get(`/api/vehicle/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = response.data.data;
                setIsVehicleExisst(true);
                setVehicle(data);
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
                    alert(err.response.data.message || "Something went wrong, Failed to load vehicle details");
                } else {
                    console.log("Network or other error:", err.message);
                    alert("Network error or server not reachable");
                }
            }
        } catch (error) {
            console.error("Error in fetchVehicleDetails:", error);
            alert("An unexpected error occurred while fetching vehicle details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchVehicleDetails(user?.isOfferingRides);
        } else if (!token) {
            router.replace('/login');
        }
    }, [isAuthenticated, isVehicleExisst, isOfferingRides]);


    const handleToggleRideOffer = async () => {
        try {
            debugger
            const newValue = !user.isOfferingRides;
            try {
                const response = await axiosInstance.put(
                    `/api/user/toggle-offering/${authUser?.id}`,
                    { isOfferingRides: newValue },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                setUser((prev: any) => ({ ...prev, isOfferingRides: newValue }));
                updateUser({ isOfferingRides: newValue });
                setIsOfferingRides(newValue);
                await fetchVehicleDetails(newValue);
            } catch (err: any) {
                if (err.response) {
                    console.log("Error response:", err.response.data);
                    alert(err.response.data.message || "Something went wrong, Failed to toggle ride offering");
                } else {
                    console.log("Network or other error:", err.message);
                    alert("Network error or server not reachable");
                }
            }
        } catch (error) {
            console.error("Error in handleToggleRideOffer:", error);
            alert("An unexpected error occurred while updating ride offering status");
        }
    };

    const handleSaveVehicle = async (data: any) => {
        try {
            try {
                const response = await axiosInstance.post("/api/vehicle/create", data, {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
                });
                await handleToggleRideOffer();
                await fetchVehicleDetails(true);
                setShowModal(false);
            } catch (err: any) {
                if (err.response) {
                    console.log("Error response:", err.response.data);
                    alert(err.response.data.message || "Something went wrong, Failed to save vehicle");
                } else {
                    console.log("Network or other error:", err.message);
                    alert("Network error or server not reachable");
                }
            }
        } catch (error) {
            console.error("Error in handleSaveVehicle:", error);
            alert("An unexpected error occurred while saving vehicle details");
        }
    };

    const returnProfile = () => {
        if (authUser) {
            return <>
                <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
                    {user?.profile?.avatar ? (
                        <img
                            src={`${process.env.NEXT_PUBLIC_API_URL}/api/image/files/${user?.profile?.avatar}`}
                            alt="avatar"
                            className="w-16 h-16 rounded-full object-cover border cursor-pointer"
                            onClick={() => {
                                setShowAvatarModal(true);
                            }}
                        />
                    ) : (
                        <div
                            className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs cursor-pointer"
                            onClick={() => {
                                setShowAvatarModal(true);
                            }}
                        >
                            No Avatar
                        </div>
                    )}
                    <div className="space-y-1 text-sm text-gray-800">
                        <div className="font-medium text-base">
                            {user?.firstName} {user?.lastName}
                        </div>
                        <div className="text-gray-600">{user?.email}</div>
                        <div className="text-gray-600">📞 {user?.mobileNumber}</div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-800">Offering Rides</div>
                    <button
                        onClick={async () => {
                            if (isVehicleExisst) {
                                await handleToggleRideOffer();
                            } else {
                                setShowModal(true);
                            }
                        }}
                        className={`px-4 py-1.5 text-sm font-medium rounded-full shadow-sm transition cursor-pointer 
                        ${user?.isOfferingRides ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                    >
                        {user?.isOfferingRides ? "Enabled" : "Disabled"}
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-4 space-y-2 text-sm text-gray-800">
                    <div className="flex justify-between items-center">
                        <div className="font-medium text-base">Personal Details</div>
                        <button
                            onClick={() => alert("Open edit modal for personal details")}
                            className="text-gray-500 hover:text-blue-600 transition"
                            title="Edit"
                        >
                            <RiPencilLine className="text-lg" />
                        </button>
                    </div>
                    <div>
                        <strong>Age:</strong> {user?.profile?.age || "-"}
                    </div>
                    <div>
                        <strong>Gender:</strong> {user?.profile?.gender || "-"}
                    </div>
                    <div>
                        <strong>Home:</strong> {user?.profile?.homeAddress || "-"}
                    </div>
                    <div>
                        <strong>Office:</strong> {user?.profile?.officeAddress || "-"}
                    </div>
                </div>

                {vehicle && (
                    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="font-medium text-base">Vehicle Details</div>
                            <button
                                onClick={() => alert("Open edit modal for personal details")}
                                className="text-gray-500 hover:text-blue-600 transition"
                                title="Edit"
                            >
                                <RiPencilLine className="text-lg" />
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            {vehicle?.image ? (
                                <img
                                    src={`${process.env.NEXT_PUBLIC_API_URL}/api/image/files/${vehicle?.image}`}
                                    alt="vehicle"
                                    className="w-20 h-16 rounded-lg object-cover border shadow-sm"
                                />
                            ) : (
                                <div className="w-20 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs border">
                                    No Image
                                </div>
                            )}

                            <div className="space-y-1">
                                <div className="text-base font-medium text-gray-900">
                                    {vehicle?.model}
                                </div>
                                <div className="text-sm text-gray-600 uppercase tracking-wide">
                                    {vehicle.number}
                                </div>
                            </div>
                        </div>
                    </div>

                )}

                {(user?.profile?.officeIdCardUrl || user?.profile?.personalIdCardUrl) && (
                    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                        <div className="text-base font-medium mb-2 text-gray-800">
                            Uploaded Documents
                        </div>

                        <div className="flex gap-4 flex-wrap">
                            {user?.profile?.personalIdCardUrl ? (
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-gray-700">Personal ID Card</div>
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/api/image/files/${user?.profile?.personalIdCardUrl}`}
                                        alt="Personal ID"
                                        className="w-40 h-28 object-cover border rounded-md shadow"
                                    />
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500">No Personal ID Uploaded</div>
                            )}

                            {user?.profile?.officeIdCardUrl ? (
                                <div className="space-y-1">
                                    <div className="text-sm font-medium text-gray-700">Office ID Card</div>
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/api/image/files/${user?.profile?.officeIdCardUrl}`}
                                        alt="Office ID"
                                        className="w-40 h-28 object-cover border rounded-md shadow"
                                    />
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500">No Office ID Uploaded</div>
                            )}
                        </div>
                    </div>
                )}

                {showAvatarModal && (
                    <AvatarUploadModal
                        onClose={() => {
                            setShowAvatarModal(false);
                        }}
                        onSuccess={async () => {
                            await fetchUserProfile();
                            setShowAvatarModal(false);
                        }}
                        userId={authUser?.id}
                        token={token}
                        image={user?.profile?.avatar}
                    />
                )}
                {showModal && (
                    <VehicleModal
                        onClose={() => {
                            setShowModal(false);
                        }}
                        onSave={handleSaveVehicle}
                    />
                )}
            </>
        }
    }

    if (loading) {
        try {
            return (
                <div className="flex flex-col items-center justify-center h-64 p-6 bg-white rounded-lg shadow-sm mt-10 max-w-md mx-auto">
                    <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 bg-white rounded-full"></div>
                        </div>
                    </div>
                    <p className="text-center text-gray-800 font-bold text-xl mt-6">Loading Profile</p>
                    <p className="text-center text-gray-500 mt-2">Retrieving your information...</p>
                </div>
            );
        } catch (error) {
            return (
                <div className="p-10 text-center">
                    <p className="text-lg">Loading profile...</p>
                </div>
            );
        }
    } else {
        return <div className="p-4 max-w-lg mx-auto space-y-4 bg-[#f0f2f5] min-h-screen">
            <div className="flex items-center justify-between pb-2 border-gray-300">
                <h1 className="text-xl font-bold text-gray-800">Profile</h1 >
            </div>
            {returnProfile()}
        </div >
    }
}