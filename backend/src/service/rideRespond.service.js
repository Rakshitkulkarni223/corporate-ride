const { RIDE_REQUEST_STATUS } = require("../helpers/constants");
const RideOffer = require("../model/RideOffer");
const RideRequest = require("../model/RideRequest");
const checkUserAccess = require("../utils/checkAccess");

const handleRideRequest = async ({ requestId, status, userId, loggedInUserId }) => {
    try {
        checkUserAccess(userId, loggedInUserId)

        if (![RIDE_REQUEST_STATUS.ACCEPTED, RIDE_REQUEST_STATUS.REJECTED].includes(status)) {
            throw {
                status: 400,
                message: "Invalid status."
            };
        }
        
        let request;
        try {
            request = await RideRequest.findById(requestId).populate("rideOffer");
        } catch (dbError) {
            throw {
                status: 500,
                message: "Database error while finding request"
            };
        }

        if (!request) {
            throw {
                status: 404,
                message: "Request not found."
            };
        }

        if (String(request.rideOffer.owner) !== String(userId)) {
            throw {
                status: 403,
                message: "Not authorized."
            };
        }

        if (request.status !== RIDE_REQUEST_STATUS.SENT) {
            throw {
                status: 400,
                message: "Request already responded."
            };
        }

        request.status = status;
        request.respondedAt = new Date();

        if (status === RIDE_REQUEST_STATUS.ACCEPTED) {
            let ride;
            try {
                ride = await RideOffer.findById(request.rideOffer._id);
            } catch (dbError) {
                throw {
                    status: 500,
                    message: "Database error while finding ride offer"
                };
            }

            if (ride.availableSeats <= 0) {
                throw {
                    status: 400,
                    message: "No seats available."
                };
            }

            ride.availableSeats -= 1;
            try {
                await ride.save();
            } catch (saveError) {
                throw {
                    status: 500,
                    message: "Failed to update ride seats"
                };
            }
        }

        try {
            await request.save();
        } catch (saveError) {
            throw {
                status: 500,
                message: "Failed to update request status"
            };
        }

        return {
            status: 200,
            message: `Request ${status}`,
            data: {...request.toObject()}
        }
    } catch (error) {
        throw {
            status: 500,
            message: `Something went wrong! ${error.message}`
        };
    }
};


module.exports = {
    handleRideRequest
}
