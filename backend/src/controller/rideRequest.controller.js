const { createRideRequest, getRelevantRideRequests } = require("../service/rideRequest.service");
const handleResponse = require("../utils/handleResponse");

const sendRideRequest = async (req, res) => {
  await handleResponse(req, res, async () => {
    const { userId, rideId, message } = req.body;
    const loggedInUserId = req.userId;
    return await createRideRequest({ rideId, message, userId, loggedInUserId })
  })
};


const getRideRequests = async (req, res) => {
  await handleResponse(req, res, async () => {
    const { userId } = req.body;
    const loggedInUserId = req.userId;
    return await getRelevantRideRequests({ userId, loggedInUserId });
  })
};

module.exports = {
  sendRideRequest,
  getRideRequests
}
