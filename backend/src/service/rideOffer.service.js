const { RIDE_OFFER_STATUS, RIDE_REQUEST_STATUS } = require("../helpers/constants");
const RideOffer = require("../model/RideOffer");
const RideRequest = require("../model/RideRequest");
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
    data: { ...rideOffer },
  };
};

const updateRideOffer = async ({
  pickupLocation,
  dropLocation,
  rideDateTime,
  availableSeats,
  vehicleId,
  type,
  userId,
  rideId,
}) => {
  const vehicle = await Vehicle.findOne({ _id: vehicleId, owner: userId });
  if (!vehicle) {
    throw { status: 403, message: "You are not authorized to use this vehicle." };
  }

  const rideOffer = await RideOffer.findById(rideId);
  if (!rideOffer) {
    throw { status: 400, message: "Ride offer not found." };
  }

  if (rideOffer.status === RIDE_OFFER_STATUS.COMPLETED) {
    throw {
      status: 400,
      message: "You cannot update this scheduled ride as its status is complete.",
    };
  }

  rideOffer.pickupLocation = pickupLocation || rideOffer.pickupLocation;
  rideOffer.dropLocation = dropLocation || rideOffer.dropLocation;
  rideOffer.rideDateTime = rideDateTime || rideOffer.rideDateTime;
  rideOffer.availableSeats = availableSeats || rideOffer.availableSeats;
  rideOffer.type = type || rideOffer.type;

  await rideOffer.save();

  return {
    status: 200,
    message: "Ride offer updated successfully.",
    data: rideOffer,
  };
};


const fetchRideOffers = async ({ filter }) => {
  const isOfferingUser = !!filter.owner;

  if (filter.status && !Object.values(RIDE_OFFER_STATUS).includes(filter.status)) {
    delete filter.status;
  }

  if (isOfferingUser) {
    const query = { ...filter };

    const rides = await RideOffer.find(query)
      .select("_id pickupLocation dropLocation rideDateTime availableSeats vehicle status")
      .populate("vehicle", "model registrationNumber image")
      .populate("owner", "firstName lastName");

    return {
      status: 200,
      message: "Fetched offered rides.",
      data: [...rides],
    };
  } else {

    const userId = filter.userId;
    if (!userId) {
      return { status: 400, message: "Missing userId for ride request filter." };
    }

    const acceptedRequests = await RideRequest.find({
      passenger: userId,
      status: RIDE_REQUEST_STATUS.ACCEPTED,
    }).select("rideOffer");

    const acceptedRideIds = new Set(acceptedRequests.map(req => req.rideOffer.toString()));

    const sentRequests = await RideRequest.find({
      passenger: userId,
      status: RIDE_REQUEST_STATUS.SENT,
    }).select("rideOffer");

    const sentRideIds = sentRequests.map(req => req.rideOffer.toString());

    const rides = await RideOffer.find({
      _id: { $in: sentRideIds.filter(id => !acceptedRideIds.has(id)) },
      status: RIDE_OFFER_STATUS.ACTIVE,
    })
      .select("_id pickupLocation dropLocation rideDateTime availableSeats vehicle status")
      .populate("vehicle", "model registrationNumber image")
      .populate("owner", "firstName lastName");

    return {
      status: 200,
      message: "Fetched ride offers user has requested.",
      data: [...rides],
    };
  }
};


module.exports = {
  createRideOffer,
  fetchRideOffers,
  updateRideOffer
};