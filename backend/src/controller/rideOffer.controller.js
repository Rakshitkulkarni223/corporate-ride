const { createRideOffer, getActiveRideOffers } = require("../service/rideOffer.service");
const handleResponse = require("../utils/handleResponse");

const createRide = (req, res) =>
  handleResponse(req, res, async (req) => {
    const userId = req.userId;
    const { pickupLocation, dropLocation, rideDateTime, availableSeats, vehicleId, type } = req.body;

    return await createRideOffer({
      pickupLocation,
      dropLocation,
      rideDateTime,
      availableSeats,
      vehicleId,
      type,
      userId,
    });
  });

const getRides = (req, res) =>
  handleResponse(req, res, async () => {
    return await getActiveRideOffers();
  });

module.exports = {
  createRide,
  getRides,
};
