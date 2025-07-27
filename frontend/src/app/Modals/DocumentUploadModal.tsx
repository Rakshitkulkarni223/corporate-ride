"use client";

import { useState, ChangeEvent } from "react";
import { FaTimes, FaIdCard, FaUpload, FaSpinner } from "react-icons/fa";
import axiosInstance from "../utils/axiosInstance";

interface DocumentUploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  token: string | null;
}

export default function DocumentUploadModal({
  onClose,
  onSuccess,
  userId,
  token,
}: DocumentUploadModalProps) {
  const [officeIdFile, setOfficeIdFile] = useState<File | null>(null);
  const [personalIdFile, setPersonalIdFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "office" | "personal"
  ) => {
    try {
      if (e.target.files && e.target.files[0]) {
        if (type === "office") {
          setOfficeIdFile(e.target.files[0]);
        } else {
          setPersonalIdFile(e.target.files[0]);
        }
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error handling file selection:", error);
      setErrorMessage("Failed to select file. Please try again.");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!officeIdFile || !personalIdFile) {
        setErrorMessage("Both office and personal ID documents are required");
        return;
      }
      
      if (!token) {
        setErrorMessage("Authentication token is missing. Please log in again.");
        return;
      }

      setIsUploading(true);
      setErrorMessage("");

      const formData = new FormData();
      formData.append("officeIdCardUrl", officeIdFile);
      formData.append("personalIdCardUrl", personalIdFile);

      try {
        await axiosInstance.put(`/api/user/upload-documents/${userId}`, formData, {
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
          setErrorMessage(err.response.data.message || "Failed to upload documents");
        } else {
          setErrorMessage("Network error or server not reachable");
        }
      }
    } catch (error) {
      console.error("Error in document upload:", error);
      setIsUploading(false);
      setErrorMessage("An unexpected error occurred");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-semibold">Required Documents</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimes />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Before proceeding, we need to verify your identity. Please upload the following documents:
            </p>

            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start mb-2">
                  <FaIdCard className="text-blue-500 mr-2 mt-1" />
                  <div>
                    <p className="font-medium">Office ID Card</p>
                    <p className="text-sm text-gray-500">
                      Upload a clear photo or scan of your official workplace ID
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block w-full">
                    <div className={`border ${officeIdFile ? 'border-green-300 bg-green-50' : 'border-gray-300'} rounded cursor-pointer px-4 py-2 text-center`}>
                      {officeIdFile ? (
                        <span className="text-green-600">{officeIdFile.name}</span>
                      ) : (
                        <span className="text-gray-500 flex items-center justify-center">
                          <FaUpload className="mr-2" /> Select Office ID
                        </span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "office")}
                      />
                    </div>
                  </label>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start mb-2">
                  <FaIdCard className="text-blue-500 mr-2 mt-1" />
                  <div>
                    <p className="font-medium">Personal ID Card</p>
                    <p className="text-sm text-gray-500">
                      Upload a government-issued ID (passport, driver's license, etc.)
                    </p>
                  </div>
                </div>
                <div className="mt-2">
                  <label className="block w-full">
                    <div className={`border ${personalIdFile ? 'border-green-300 bg-green-50' : 'border-gray-300'} rounded cursor-pointer px-4 py-2 text-center`}>
                      {personalIdFile ? (
                        <span className="text-green-600">{personalIdFile.name}</span>
                      ) : (
                        <span className="text-gray-500 flex items-center justify-center">
                          <FaUpload className="mr-2" /> Select Personal ID
                        </span>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, "personal")}
                      />
                    </div>
                  </label>
                </div>
              </div>
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
              disabled={isUploading || !officeIdFile || !personalIdFile}
            >
              {isUploading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" /> Uploading...
                </>
              ) : (
                "Submit Documents"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
