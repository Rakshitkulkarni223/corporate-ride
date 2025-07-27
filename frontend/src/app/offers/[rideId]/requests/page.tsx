"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/app/utils/axiosInstance";
import { useAuth } from "@/app/contexts/AuthContext";
import { RIDE_REQUEST_STATUS, RideRequestType } from "@/app/utils/constants";

export default function RideRequestsPage() {
  const { token, user, isAuthenticated, logout } = useAuth();
  const { rideId } = useParams();
  const router = useRouter();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<RideRequestType | 'Sent'>(RIDE_REQUEST_STATUS.SENT);

  const fetchRideRequests = async () => {
    setLoading(true);
    try {
      try {
        const response = await axiosInstance.post(
          `/api/ride/requests/${rideId}`,
          { userId: user?.id, status: filter },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRequests(response.data.data || []);
      } catch (err: any) {
        // Check for authentication errors
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log('Session expired, redirecting to login');
          logout();
          router.replace('/login');
          return;
        }

        console.error("Error fetching ride requests:", err);
        if (err.response) {
          alert(err.response.data.message || "Failed to load ride requests.");
        } else {
          alert("Network error or server not reachable");
        }
      }
    } catch (error) {
      console.error("Error in fetchRideRequests:", error);
      alert("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const respondToRequest = async (requestId: string, action: RideRequestType) => {
    try {
      try {
        await axiosInstance.post(
          `/api/ride/request/${requestId}/respond`,
          { userId: user?.id, status: action },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Remove request after responding
        setRequests((prev: any) => prev.filter((r: any) => r._id !== requestId));
      } catch (err: any) {
        // Check for authentication errors
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log('Session expired, redirecting to login');
          logout();
          router.replace('/login');
          return;
        }

        console.error("Error responding to request:", err);
        if (err.response) {
          alert(err.response.data.message || "Failed to update request status.");
        } else {
          alert("Network error or server not reachable");
        }
      }
    } catch (error) {
      console.error("Error in respondToRequest:", error);
      alert("An unexpected error occurred while processing your request.");
    }
  };

  useEffect(() => {
    if (isAuthenticated && rideId) {
      fetchRideRequests();
    } else if (!token && rideId) {
      router.replace('/login');
    }
  }, [rideId, token, filter, isAuthenticated]);

  const filterOptions = [
    { label: "Pending", value: RIDE_REQUEST_STATUS.SENT },
    { label: "Accepted", value: RIDE_REQUEST_STATUS.ACCEPTED },
    { label: "Rejected", value: RIDE_REQUEST_STATUS.REJECTED }
  ];

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-lg font-semibold text-gray-800 mb-4">Ride Requests</h1>

      {/* Filter Buttons */}
      <div className="flex justify-center gap-2 mb-4">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              try {
                setFilter(opt.value);
              } catch (error) {
                console.error("Error setting filter:", error);
              }
            }}
            className={`px-4 py-1 text-sm rounded-full border transition-all ${filter === opt.value
                ? "bg-blue-100 text-blue-900 border-blue-300"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : requests.length === 0 ? (
        <p className="text-gray-500">No {filter.toLowerCase()} requests.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((req: any) => (
            <div key={req._id} className="border p-3 rounded-md bg-white shadow-sm space-y-2">
              <div className="text-sm font-medium text-gray-800">
                {req.passenger?.firstName} {req.passenger?.lastName}
              </div>
              <div className="text-xs text-gray-500">{req.passenger?.email}</div>

              {filter === RIDE_REQUEST_STATUS.SENT && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      try {
                        respondToRequest(req._id, RIDE_REQUEST_STATUS.ACCEPTED);
                      } catch (error) {
                        console.error("Error accepting request:", error);
                        alert("Failed to accept request. Please try again.");
                      }
                    }}
                    className="flex-1 bg-green-700 text-white text-sm py-1 rounded hover:bg-green-900"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      try {
                        respondToRequest(req._id, RIDE_REQUEST_STATUS.REJECTED);
                      } catch (error) {
                        console.error("Error rejecting request:", error);
                        alert("Failed to reject request. Please try again.");
                      }
                    }}
                    className="flex-1 bg-red-600 text-white text-sm py-1 rounded hover:bg-red-900"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
