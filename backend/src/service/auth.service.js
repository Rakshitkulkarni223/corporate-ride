const User = require("../model/User");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../utils/token");

const loginUserService = async ({ mobileNumber, password }) => {
    if (!mobileNumber || !password) {
        throw {
            status: 400,
            message: "Mobile number and password are required",
        };
    }

    const user = await User.findOne({ mobileNumber });
    if (!user) {
        throw {
            status: 404,
            message: "User with this mobile number does not exist.",
        };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw {
            status: 401,
            message: "Incorrect password. Please try again.",
        };
    }

    const accessTokenObj = await generateJWT(user, process.env.ACCESS_TOKEN_SECRET, "ACCESS")

    const refreshTokenObj = await generateJWT(user, process.env.REFRESH_TOKEN_SECRET, "REFRESH")

    // update refresh token
    user.refreshToken = refreshTokenObj.token;
    await user.save();

    return {
        status: 200,
        message: "Login successful",
        refreshTokenObj,
        data: {
            userId: user._id,
            token: accessTokenObj.token,
            expires: accessTokenObj.expires,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobileNumber: user.mobileNumber,
        },
    };
};

module.exports = { loginUserService };