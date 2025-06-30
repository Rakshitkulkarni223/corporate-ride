const User = require("../model/User");
const { saveUserDetails, updateUserDetails, getUserDetails, getUserProfileDetails, toggleOfferingStatusService } = require("../service/user.service");
const handleResponse = require("../utils/handleResponse");

const registerUser = async (req, res) => {
    await handleResponse(req, res, async () => {
        const { body } = req;
        return await saveUserDetails(body);
    });
};


const updateUserProfile = async (req, res) => {
    await handleResponse(req, res, async () => {
        const { body, files } = req;
        const userId = params.id;
        const loggedInUserId = req.userId;
        return await updateUserDetails({ userId, files, body, loggedInUserId });
    });
};

const toggleOfferingStatus = async (req, res) => {
     await handleResponse(req, res, async () => {
        const userId = params.id;
        const loggedInUserId = req.userId;
        return await toggleOfferingStatusService({ userId, loggedInUserId });
    });
};

const getUserById = async (req, res) => {
    await handleResponse(req, res, async () => {
        const userId = req.params.id;
        const loggedInUserId = req.userId;
        return await getUserDetails(userId, loggedInUserId);
    });
};


const getUserProfileById = async (req, res) => {
    await handleResponse(req, res, async () => {
        const userId = req.params.id;
        const loggedInUserId = req.userId;
        return await getUserProfileDetails(userId, loggedInUserId);
    });
};

module.exports = {
    registerUser,
    updateUserProfile,
    getUserById,
    getUserProfileById,
    toggleOfferingStatus
};
