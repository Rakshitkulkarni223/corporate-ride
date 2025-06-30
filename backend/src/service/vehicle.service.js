const { getBucket } = require("../database");
const User = require("../model/User");
const Vehicle = require("../model/Vehicle");
const { postImageUpload } = require("../utils/handleImageUpload");

const createVehicle = async ({ userId, body, files }) => {
  const existingVehicle = await Vehicle.findOne({ owner: userId });
  if (existingVehicle) {
    return {
      status: 400,
      message: "Vehicle already exists. You can update it.",
    };
  }

  const user = await User.findById(userId);

  if (!user) {
    return {
      status: 404,
      message: "User not found.",
    };
  }

  const bucket = getBucket();
  const mobileNumber = user?.mobileNumber || "temp";
  const fields = ["image"];

  const { uploadedFiles, uploadedFileIds } = await postImageUpload(files, fields, mobileNumber);
  try {
    const vehicle = await Vehicle.create({ ...body, owner: userId, ...(uploadedFiles.image && { image: uploadedFiles.image }) });

    return {
      status: 201,
      message: "Vehicle created successfully",
      data: vehicle,
    };
  }
  catch (err) {
    console.error("Vheicle creation failed. Cleaning up uploaded files...", err);

    for (const fileId of uploadedFileIds) {
      try {
        await bucket.delete(fileId);
      } catch (delErr) {
        console.error(`Failed to delete file with id ${fileId}`, delErr);
      }
    }

    throw {
      status: 500,
      message: "Failed to save vehicle details.",
    };
  }
};

const getMyVehicle = async (userId) => {
  const vehicle = await Vehicle.findOne({ owner: userId });

  return {
    status: 200,
    message: "Vehicle fetched successfully",
    data: vehicle || null,
  };
};

const updateVehicle = async (vehicleId, userId, updates) => {
  const vehicle = await Vehicle.findOneAndUpdate(
    { _id: vehicleId, owner: userId },
    updates,
    { new: true }
  );

  if (!vehicle) {
    return {
      status: 404,
      message: "Vehicle not found or not authorized",
    };
  }

  return {
    status: 200,
    message: "Vehicle updated successfully",
    data: vehicle,
  };
};

module.exports = {
  createVehicle,
  getMyVehicle,
  updateVehicle,
};
