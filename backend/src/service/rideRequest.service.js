const RideOffer = require("../model/RideOffer");
const RideRequest = require("../model/RideRequest");
const User = require("../model/User");
const checkUserAccess = require("../utils/checkAccess");

const createRideRequest = async ({ rideId, message, userId, loggedInUserId }) => {
    checkUserAccess(userId, loggedInUserId)

    const existing = await RideRequest.findOne({
        rideOffer: rideId,
        passenger: userId,
        status: { $in: ["sent", "accepted"] },
    });

    if (existing) {
        throw {
            status: 400,
            message: "You already sent a request.",
        };
    }

    const ride = await RideOffer.findById(rideId);
    if (!ride) {
        throw {
            status: 404,
            message: "Ride not found.",
        };
    }

    if (ride.rideDateTime < new Date()) {
        throw {
            status: 400,
            message: "Ride has already started.",
        };
    }

    const request = await RideRequest.create({
        rideOffer: rideId,
        passenger: userId,
        message
    });

    return {
        status: 201,
        message: "Request sent.",
        data: {...request },
    };
};

const getRelevantRideRequests = async ({ userId, loggedInUserId }) => {
    checkUserAccess(userId, loggedInUserId);

    const user = await User.findById(userId);
    if (!user) {
        return {
            status: 404,
            message: "User not found",
        };
    }

    if (user.isOfferingRides) {
        const rideIds = await RideOffer.find({ owner: userId }).distinct("_id");

        const requests = await RideRequest.find({ rideOffer: { $in: rideIds } })
            .populate("passenger", "firstName lastName email")
            .populate("rideOffer", "pickupLocation dropLocation rideDateTime");

        return {
            status: 200,
            message: "Ride requests for your offers.",
            data: [ ...requests ]
        };
    }

    const requests = await RideRequest.find({ passenger: userId })
        .populate("rideOffer", "pickupLocation dropLocation rideDateTime owner")
        .populate("rideOffer.owner", "firstName lastName email");

    return {
        status: 200,
        message: "Your ride requests.",
        data: [ ...requests ]
    };
};

module.exports = { createRideRequest, getRelevantRideRequests };