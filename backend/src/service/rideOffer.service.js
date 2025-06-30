const RideOffer = require("../model/RideOffer");
const Vehicle = require("../model/Vehicle");

const createRideOffer = async ({ pickupLocation, dropLocation, rideDateTime, availableSeats, vehicleId, type, userId }) => {
  const vehicle = await Vehicle.findOne({ _id: vehicleId, owner: userId });
  if (!vehicle) {
    throw { status: 403, message: "You are not authorized to use this vehicle." };
  }

  const rideOffer = new RideOffer({
    pickupLocation,
    dropLocation,
    rideDateTime,
    availableSeats,
    type,
    vehicle: vehicleId,
    owner: userId,
  });

  await rideOffer.save();

  return {
    status: 201,
    message: "Ride offer created successfully.",
    data: {...rideOffer},
  };
};

const getActiveRideOffers = async () => {
  const rides = await RideOffer.find({ rideDateTime: { $gte: new Date() } })
    .populate("vehicle", "model number image")
    .populate("owner", "firstName lastName");

  return {
    message: "Fetched active ride offers.",
    data: [...rides],
  };
};

module.exports = {
  createRideOffer,
  getActiveRideOffers,
};