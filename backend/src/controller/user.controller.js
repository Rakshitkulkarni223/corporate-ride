const User = require("../model/User");
const { saveUserDetails, updateUserDetails } = require("../service/user.service");
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

    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
      throw {
        status: 404,
        message: "User not found.",
      };
    }

    return {
      status: 200,
      message: "User fetched successfully",
      data: user,
    };
  });
};

module.exports = {
    registerUser,
    updateUserProfile,
    getUserById
};
