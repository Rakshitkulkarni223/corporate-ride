"use client";

import { useState, ChangeEvent } from "react";
import { FaTimes, FaUpload, FaSpinner, FaTrash } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";

interface AvatarUploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  token: string | null;
  image?: string;
}

export default function AvatarUploadModal({
  onClose,
  onSuccess,
  userId,
  token,
  image,
}: AvatarUploadModalProps) {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showImageView, setShowImageView] = useState(!!image);

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
        
        try {
          // Switch back to image view if upload is successful
          setShowImageView(true);
          // Notify parent component to refresh data
          onSuccess();
        } catch (navigationError) {
          console.error("Error during success navigation:", navigationError);
        }
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


  const handleDeleteAvatar = async () => {
    try {
      setIsDeleting(true);
      setErrorMessage("");
      
      try {
        await axiosInstance.put(`/api/user/delete-avatar/${userId}`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        onSuccess();
      } catch (error) {
        console.error("Error deleting avatar:", error);
        setErrorMessage("Failed to delete avatar. Please try again.");
      } finally {
        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error in delete handler:", error);
      setErrorMessage("An unexpected error occurred");
      setIsDeleting(false);
    }
  };

  try {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg max-w-sm w-full">
          <div className="flex justify-between items-center border-b p-4">
            <h2 className="text-lg font-semibold">Upload Avatar</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <FaTimes />
            </button>
          </div>

          {showImageView && image ? (
            <div className="p-3">
              <div className="flex justify-center mb-3">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}/api/image/files/${image}`}
                  alt="User Avatar"
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                />
              </div>
              
              {errorMessage && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded border border-red-200 mb-4">
                  {errorMessage}
                </div>
              )}
              
              <div className="flex space-x-3 justify-center mt-3">
                <button
                  onClick={handleDeleteAvatar}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrash className="mr-0" />
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    try {
                      // Switch to upload mode
                      setShowImageView(false);
                      setAvatarFile(null);
                    } catch (error) {
                      console.error("Error setting up for new upload:", error);
                      setErrorMessage("Failed to prepare upload form. Please try again.");
                    }
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                  disabled={isDeleting}
                >
                  <FaUpload className="mr-0" />
                </button>
              </div>
            </div>
          ) : (

            <div className="p-4 max-w-sm mx-auto">
              <div className="mb-4">

                <div className="border border-gray-200 rounded-xl p-5 bg-gradient-to-b from-gray-50 to-white shadow-sm">
                  <div className="flex justify-center mb-4">
                    {avatarFile ? (
                      <div 
                        className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500 shadow-md transition-all duration-300 transform hover:scale-105"
                        style={{ boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.2)" }}
                      >
                        <img
                          src={URL.createObjectURL(avatarFile)}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center shadow-inner transition-all duration-300">
                        <FaUpload className="text-blue-400 text-2xl opacity-70" />
                      </div>
                    )}
                  </div>

                  <label className="block w-full transition-all duration-200">
                    <div 
                      className={`
                        border rounded-lg cursor-pointer px-3 py-2 text-center transition-all duration-300 
                        ${avatarFile 
                          ? 'border-green-400 bg-green-50 shadow-sm' 
                          : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'}
                      `}
                    >
                      {avatarFile ? (
                        <span className="text-green-600 font-light text-sm flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {avatarFile.name}
                        </span>
                      ) : (
                        <span className="text-gray-600 flex items-center justify-center font-light text-sm">
                          <FaUpload className="mr-2 text-blue-500" /> Select Avatar Image
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
                  <div className="mt-3 p-2 bg-red-50 text-red-700 rounded border border-red-200 text-sm">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errorMessage}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-3">
                <button
                  onClick={onClose}
                  className="px-3 py-2 border border-gray-300 rounded text-gray-700 text-sm hover:bg-gray-100 transition-colors duration-200"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className={`
                    px-3 py-2 bg-blue-500 text-white rounded text-sm flex items-center
                    ${!avatarFile || isUploading 
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:bg-blue-600'}
                  `}
                  disabled={isUploading || !avatarFile}
                >
                  {isUploading ? (
                    <>
                      <FaSpinner className="animate-spin mr-1" /> Uploading...
                    </>
                  ) : (
                    "Upload Avatar"
                  )}
                </button>
              </div>
            </div>
          )
          }
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
