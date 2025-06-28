const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
            status: 401,
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

    const accessToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
    );

    // update refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return {
        status: 200,
        message: "Login successful",
        refreshToken,
        data: {
            userId: user._id,
            token: accessToken,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobileNumber: user.mobileNumber,
        },
    };
};

module.exports = { loginUserService };