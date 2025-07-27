"use client";

import { useState, ChangeEvent } from "react";
import { FaTimes, FaUpload, FaSpinner } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";

interface AvatarUploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  token: string | null;
}

export default function AvatarUploadModal({
  onClose,
  onSuccess,
  userId,
  token,
}: AvatarUploadModalProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files[0]) {
        setAvatarFile(e.target.files[0]);
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error handling file selection:", error);
      setErrorMessage("Failed to select file. Please try again.");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!avatarFile) {
        setErrorMessage("Please select an avatar image");
        return;
      }
      
      if (!token) {
        setErrorMessage("Authentication token is missing. Please log in again.");
        return;
      }

      setIsUploading(true);
      setErrorMessage("");

      const formData = new FormData();
      formData.append("avatar", avatarFile);

      try {
        await axiosInstance.put(`/api/user/update-avatar/${userId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        setIsUploading(false);
        onSuccess();
      } catch (err: any) {
        setIsUploading(false);
        if (err.response) {
          setErrorMessage(err.response.data.message || "Failed to upload avatar");
        } else {
          setErrorMessage("Network error or server not reachable");
        }
      }
    } catch (error) {
      console.error("Error in avatar upload:", error);
      setIsUploading(false);
      setErrorMessage("An unexpected error occurred");
    }
  };

  try {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
          <div className="flex justify-between items-center border-b p-4">
            <h2 className="text-lg font-semibold">Upload Avatar</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          <div className="p-5">
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Please upload a profile picture to personalize your account.
              </p>

              <div className="border rounded-lg p-6 bg-gray-50">
                <div className="flex justify-center mb-4">
                  {avatarFile ? (
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-blue-500">
                      <img
                        src={URL.createObjectURL(avatarFile)}
                        alt="Avatar Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                      <FaUpload className="text-gray-400 text-3xl" />
                    </div>
                  )}
                </div>
                
                <label className="block w-full">
                  <div className={`border ${avatarFile ? 'border-green-300 bg-green-50' : 'border-gray-300'} rounded cursor-pointer px-4 py-3 text-center`}>
                    {avatarFile ? (
                      <span className="text-green-600">{avatarFile.name}</span>
                    ) : (
                      <span className="text-gray-500 flex items-center justify-center">
                        <FaUpload className="mr-2" /> Select Avatar Image
                      </span>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </label>
              </div>

              {errorMessage && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
                  {errorMessage}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                disabled={isUploading || !avatarFile}
              >
                {isUploading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Uploading...
                  </>
                ) : (
                  "Upload Avatar"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error rendering AvatarUploadModal:", error);
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
