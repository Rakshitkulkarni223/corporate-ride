const { createRideRequest, getMyRideRequests, getOfferedRideRequests } = require("../service/rideRequest.service");
const handleResponse = require("../utils/handleResponse");

const sendRideRequest = async (req, res) => {
  await handleResponse(req, res, async () => {
    const { userId, rideId, message } = req.body;
    const loggedInUserId = req.userId;
    return await createRideRequest({ rideId, message, userId, loggedInUserId })
  })
};


const getMyRequests = async (req, res) => {
  await handleResponse(req, res, async () => {
    const { userId } = req.body;
    const { status } = req.query;
    const loggedInUserId = req.userId;
    const filter = { status, passenger: req.userId }
    return await getMyRideRequests({ userId, loggedInUserId, filter });
  })
};


const getOfferedRequests = async (req, res) => {
  await handleResponse(req, res, async () => {
    const { userId } = req.body;
    const { rideId } = req.params;
    const loggedInUserId = req.userId;
    return await getOfferedRideRequests({ userId, loggedInUserId, rideId });
  })
};

module.exports = {
  sendRideRequest,
  getMyRequests,
  getOfferedRequests
}
