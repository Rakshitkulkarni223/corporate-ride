"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axiosInstance from "@/app/utils/axiosInstance";
import { useAuth } from "@/app/contexts/AuthContext";

export default function RideRequestsPage() {
  const { token, user } = useAuth();
  const { rideId } = useParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideRequests = async () => {
      try {
        const response = await axiosInstance.post(`/api/ride/requests/${rideId}`, { userId: user?.id }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data.data || []);
      } catch (err) {
        console.error("Error fetching ride requests:", err);
        alert("Failed to load ride requests.");
      } finally {
        setLoading(false);
      }
    };

    if (rideId && token) {
      fetchRideRequests();
    }
  }, [rideId, token]);

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-lg font-semibold text-gray-800 mb-4">Ride Requests</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No requests for this ride.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((req: any) => (
            <div key={req._id} className="border p-3 rounded-md bg-white shadow-sm">
              <div className="text-sm font-medium text-gray-800">
                {req.passenger?.firstName} {req.passenger?.lastName}
              </div>
              <div className="text-xs text-gray-500">{req.passenger?.email}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
