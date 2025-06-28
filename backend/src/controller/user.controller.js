const User = require("../model/User");
const { saveUserDetails, updateUserDetails, getUserDetails, getUserProfileDetails } = require("../service/user.service");
const checkUserAccess = require("../utils/checkAccess");
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
        checkUserAccess(userId, loggedInUserId);

        if (!userId) {
            throw {
                status: 400,
                message: "User ID is missing.",
            };
        }

        return await updateUserDetails({ userId, files, body });
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
    getUserProfileById
};
