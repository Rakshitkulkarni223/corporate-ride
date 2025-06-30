const Vehicle = require("../model/Vehicle");

const createVehicle = async (userId, data) => {
  const existing = await Vehicle.findOne({ owner: userId });
  if (existing) {
    return {
      status: 400,
      message: "Vehicle already exists. You can update it.",
    };
  }

  const vehicle = await Vehicle.create({ ...data, owner: userId });

  return {
    status: 201,
    message: "Vehicle created successfully",
    data: vehicle,
  };
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
