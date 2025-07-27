"use client";

import { useState, ChangeEvent, useEffect } from "react";
import { FaTimes, FaUser, FaHome, FaBuilding, FaSpinner } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";

interface EditProfileModalProps {
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  token: string | null;
  currentUserData: any;
}

export default function EditProfileModal({
  onClose,
  onSuccess,
  userId,
  token,
  currentUserData,
}: EditProfileModalProps) {
  // Form data states
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    homeAddress: '',
    officeAddress: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load current profile data when available
  useEffect(() => {
    try {
      if (currentUserData?.profile) {
        setFormData({
          age: currentUserData.profile.age?.toString() || '',
          gender: currentUserData.profile.gender || '',
          homeAddress: currentUserData.profile.homeAddress || '',
          officeAddress: currentUserData.profile.officeAddress || ''
        });
      }
    } catch (error) {
      console.error("Error loading current profile data:", error);
      setErrorMessage("Failed to load your current profile data.");
    }
  }, [currentUserData]);

  // Handle input change for form fields
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    try {
      const { name, value } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      setErrorMessage("");
    } catch (error) {
      console.error("Error handling input change:", error);
      setErrorMessage("Failed to update form field. Please try again.");
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate token
      if (!token) {
        setErrorMessage("Authentication token is missing. Please log in again.");
        return;
      }

      // Validate age (must be between 18-65)
      const age = parseInt(formData.age, 10);
      if (isNaN(age) || age < 18 || age > 65) {
        setErrorMessage("Age must be between 18 and 65");
        return;
      }

      // Validate other required fields
      if (!formData.gender) {
        setErrorMessage("Gender is required");
        return;
      }
      
      if (!formData.homeAddress) {
        setErrorMessage("Home address is required");
        return;
      }
      
      if (!formData.officeAddress) {
        setErrorMessage("Office address is required");
        return;
      }

      setIsUpdating(true);
      setErrorMessage("");

      // Prepare profile data for submission
      const profileData = {
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        homeAddress: formData.homeAddress,
        officeAddress: formData.officeAddress
      };

      try {
        await axiosInstance.put(`/api/user/update/${userId}`, profileData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        setIsUpdating(false);
        onSuccess();
      } catch (err: any) {
        setIsUpdating(false);
        if (err.response) {
          setErrorMessage(err.response.data.message || "Failed to update profile");
        } else {
          setErrorMessage("Network error or server not reachable");
        }
      }
    } catch (error) {
      console.error("Error in profile update:", error);
      setIsUpdating(false);
      setErrorMessage("An unexpected error occurred");
    }
  };

  try {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full my-8">
          <div className="flex justify-between items-center border-b p-4">
            <h2 className="text-lg font-semibold">Edit Your Profile</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          <div className="p-5">
            <p className="text-gray-700 mb-6">
              Update your personal information below
            </p>

            <div className="space-y-4">
              {/* Age Field */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start mb-2">
                  <FaUser className="text-blue-500 mr-2 mt-1" />
                  <div>
                    <p className="font-medium">Age</p>
                    <p className="text-sm text-gray-500">
                      Must be between 18 and 65
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    min="18"
                    max="65"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your age"
                    required
                  />
                </div>
              </div>

              {/* Gender Field */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start mb-2">
                  <FaUser className="text-blue-500 mr-2 mt-1" />
                  <div>
                    <p className="font-medium">Gender</p>
                    <p className="text-sm text-gray-500">
                      Select your gender
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Home Address */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start mb-2">
                  <FaHome className="text-blue-500 mr-2 mt-1" />
                  <div>
                    <p className="font-medium">Home Address</p>
                    <p className="text-sm text-gray-500">
                      Your residential address
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <textarea
                    name="homeAddress"
                    value={formData.homeAddress}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter your home address"
                    required
                  />
                </div>
              </div>

              {/* Office Address */}
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start mb-2">
                  <FaBuilding className="text-blue-500 mr-2 mt-1" />
                  <div>
                    <p className="font-medium">Office Address</p>
                    <p className="text-sm text-gray-500">
                      Your work location
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <textarea
                    name="officeAddress"
                    value={formData.officeAddress}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter your office address"
                    required
                  />
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-6 p-3 bg-red-50 text-red-700 rounded border border-red-200">
                {errorMessage}
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-8">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Updating...
                  </>
                ) : (
                  "Update Profile"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering EditProfileModal:", error);
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-red-600 font-bold">Error Loading Form</h3>
          <p className="mt-2">Sorry, there was an error displaying this form. Please try again.</p>
          <div className="mt-4 flex justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}
