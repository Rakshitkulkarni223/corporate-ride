const { createRideOffer, fetchRideOffers, updateRideOffer } = require("../service/rideOffer.service");
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

const updateRide = (req, res) =>
  handleResponse(req, res, async (req) => {
    const userId = req.userId;
    const rideId = req.params.id;
    const { pickupLocation, dropLocation, rideDateTime, availableSeats, vehicleId, type } = req.body;

    return await updateRideOffer({
      pickupLocation,
      dropLocation,
      rideDateTime,
      availableSeats,
      vehicleId,
      type,
      userId,
      rideId
    });
});

const fetchRides = (req, res) =>
  handleResponse(req, res, async () => {
    const { status } = req.query;
    const filter = { status }
    return await fetchRideOffers(filter);
  });

module.exports = {
  createRide,
  fetchRides,
  updateRide
};
