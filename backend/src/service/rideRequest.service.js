const { RIDE_REQUEST_STATUS } = require("../helpers/constants");
const RideOffer = require("../model/RideOffer");
const RideRequest = require("../model/RideRequest");
const User = require("../model/User");
const checkUserAccess = require("../utils/checkAccess");

const createRideRequest = async ({ rideId, message, userId, loggedInUserId }) => {
    try {
        checkUserAccess(userId, loggedInUserId)

        let existing;
        try {
            existing = await RideRequest.findOne({
                rideOffer: rideId,
                passenger: userId,
                status: { $in: [RIDE_REQUEST_STATUS.SENT, RIDE_REQUEST_STATUS.ACCEPTED] },
            });
        } catch (dbError) {
            throw {
                status: 500,
                message: "Database error while checking existing requests"
            };
        }

        if (existing) {
            throw {
                status: 400,
                message: "You already sent a request.",
            };
        }

        let ride;
        try {
            ride = await RideOffer.findById(rideId);
        } catch (dbError) {
            throw {
                status: 500,
                message: "Database error while finding ride"
            };
        }

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

        let request;
        try {
            request = await RideRequest.create({
                rideOffer: rideId,
                passenger: userId,
                message
            });
        } catch (createError) {
            throw {
                status: 500,
                message: "Failed to create ride request"
            };
        }

        return {
            status: 201,
            message: "Request sent.",
            data: { ...request.toObject() },
        };
    } catch (error) {
        throw {
            status: 500,
            message: `Something went wrong! ${error.message}`
        };
    }
};

const getMyRideRequests = async ({ userId, loggedInUserId, filter }) => {
    try {
        checkUserAccess(userId, loggedInUserId);

        let user;
        try {
            user = await User.findById(userId);
        } catch (dbError) {
            throw {
                status: 500,
                message: "Database error while finding user"
            };
        }

        if (!user) {
            return {
                status: 404,
                message: "User not found",
            };
        }

        if (!Object.values(RIDE_REQUEST_STATUS).includes(filter.status)) {
            delete filter.status;
        }

        let requests;
        try {
            requests = await RideRequest.find(filter)
                .populate({
                    path: "rideOffer",
                    select: "pickupLocation dropLocation rideDateTime owner availableSeats",
                    populate: {
                        path: "owner",
                        select: "firstName lastName email mobileNumber",
                    },
                });
        } catch (dbError) {
            throw {
                status: 500,
                message: "Database error while fetching ride requests"
            };
        }

        return {
            status: 200,
            message: "Ride requests fetched successfully.",
            data: [...requests]
        };
    } catch (error) {
        throw {
            status: 500,
            message: `Something went wrong! ${error.message}`
        };
    }
};


const getOfferedRideRequests = async ({ userId, loggedInUserId, rideId, status }) => {
    try {
        checkUserAccess(userId, loggedInUserId);

        let user;
        try {
            user = await User.findById(userId);
        } catch (dbError) {
            throw {
                status: 500,
                message: "Database error while finding user",
            };
        }

        if (!user) {
            return {
                status: 404,
                message: "User not found",
            };
        }

        let rideOfferExists;
        try {
            rideOfferExists = await RideOffer.findById(rideId);
        } catch (dbError) {
            throw {
                status: 500,
                message: "Database error while finding ride offer",
            };
        }

        if (!rideOfferExists) {
            return {
                status: 404,
                message: "Ride offer does not exist. Please refresh the page.",
            };
        }

        const filter = {
            rideOffer: rideId,
        };

        if (status) {
            filter.status = status;
        }

        let requests;
        try {
            requests = await RideRequest.find(filter)
                .populate("passenger", "firstName lastName email")
                .populate("rideOffer", "pickupLocation dropLocation rideDateTime");
        } catch (dbError) {
            throw {
                status: 500,
                message: "Database error while fetching ride requests",
            };
        }

        return {
            status: 200,
            message: "Ride requests for this offer.",
            data: [...requests]
        };
    } catch (error) {
        throw {
            status: 500,
            message: `Something went wrong! ${error.message}`
        };
    }
};



module.exports = { createRideRequest, getMyRideRequests, getOfferedRideRequests };