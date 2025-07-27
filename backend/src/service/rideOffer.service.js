const { RIDE_OFFER_STATUS, RIDE_REQUEST_STATUS } = require("../helpers/constants");
const RideOffer = require("../model/RideOffer");
const RideRequest = require("../model/RideRequest");
const Vehicle = require("../model/Vehicle");

const createRideOffer = async ({ pickupLocation, dropLocation, rideDateTime, availableSeats, vehicleId, type, userId }) => {
  try {
    let vehicle;
    try {
      vehicle = await Vehicle.findOne({ _id: vehicleId, owner: userId });
    } catch (dbError) {
      throw {
        status: 500,
        message: "Database error while finding vehicle",
        error: dbError.message
      };
    }

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

    try {
      await rideOffer.save();
    } catch (saveError) {
      throw {
        status: 500,
        message: "Failed to create ride offer",
        error: saveError.message
      };
    }

    return {
      status: 201,
      message: "Ride offer created successfully.",
      data: { ...rideOffer.toObject() },
    };
  } catch (error) {
    throw {
      status: 500,
      message: `Something went wrong! ${error.message}`
    };
  }
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
  try {
    let vehicle;
    try {
      vehicle = await Vehicle.findOne({ _id: vehicleId, owner: userId });
    } catch (dbError) {
      throw {
        status: 500,
        message: "Database error while finding vehicle",
        error: dbError.message
      };
    }

    if (!vehicle) {
      throw { status: 403, message: "You are not authorized to use this vehicle." };
    }

    let rideOffer;
    try {
      rideOffer = await RideOffer.findById(rideId);
    } catch (dbError) {
      throw {
        status: 500,
        message: "Database error while finding ride offer",
        error: dbError.message
      };
    }

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

    try {
      await rideOffer.save();
    } catch (saveError) {
      throw {
        status: 500,
        message: "Failed to update ride offer",
      };
    }

    return {
      status: 200,
      message: "Ride offer updated successfully.",
      data: rideOffer.toObject(),
    };
  } catch (error) {
    throw {
      status: 500,
      message: `Something went wrong! ${error.message}`
    };
  }
};

const updateExpiredRides = async () => {
  try {
    // Find rides that are still Active but their datetime has passed
    const currentTime = new Date();
    
    // Find active rides with past datetime
    const expiredRides = await RideOffer.find({
      status: RIDE_OFFER_STATUS.ACTIVE,
      rideDateTime: { $lt: currentTime }
    });
    
    // Update each expired ride to Completed status
    if (expiredRides.length > 0) {
      const updatePromises = expiredRides.map(ride => {
        return RideOffer.updateOne(
          { _id: ride._id },
          { $set: { status: RIDE_OFFER_STATUS.COMPLETED } }
        );
      });
      
      await Promise.all(updatePromises);
      console.log(`Updated ${expiredRides.length} expired rides to Completed status`);
    }
  } catch (error) {
    console.error("Error updating expired rides:", error);
  }
};


const fetchRideOffers = async ({ filter }) => {
  try {
    const isOfferingUser = !!filter.owner;

    if (filter.status && !Object.values(RIDE_OFFER_STATUS).includes(filter.status)) {
      delete filter.status;
    }

    if (isOfferingUser) {
      const query = { ...filter };

      let rides;
      try {
        rides = await RideOffer.find(query)
          .select("_id pickupLocation dropLocation rideDateTime availableSeats vehicle status")
          .populate("vehicle", "model registrationNumber image")
          .populate("owner", "firstName lastName");
      } catch (dbError) {
        throw {
          status: 500,
          message: "Database error while fetching offered rides",
          error: dbError.message
        };
      }

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

      const sentRequests = await RideRequest.find({
        passenger: userId,
        status: RIDE_REQUEST_STATUS.SENT,
      }).select("rideOffer");

      const acceptedRideIds = new Set(acceptedRequests.map(req => req.rideOffer.toString()));
      const sentRideIds = new Set(sentRequests.map(req => req.rideOffer.toString()));
      const allRequestedRideIds = new Set([...acceptedRideIds, ...sentRideIds]);

      const allRides = await RideOffer.find({
        status: RIDE_OFFER_STATUS.ACTIVE,
        owner: { $ne: userId },
        rideDateTime: { $gte: new Date() },
        _id: { $nin: [...allRequestedRideIds] }
      })
        .select("_id pickupLocation dropLocation rideDateTime availableSeats vehicle status")
        .populate("vehicle", "model registrationNumber image")
        .populate("owner", "firstName lastName");

      return {
        status: 200,
        message: "Fetched available ride offers for user.",
        data: allRides,
      };
    }
  } catch (error) {
    throw {
      status: 500,
      message: `Something went wrong! ${error.message}`
    };
  }
};


module.exports = {
  createRideOffer,
  fetchRideOffers,
  updateRideOffer,
  updateExpiredRides
};