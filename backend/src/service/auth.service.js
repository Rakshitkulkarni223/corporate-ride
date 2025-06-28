const User = require("../model/User");
const bcrypt = require("bcryptjs");

const loginUserService = async ({ mobileNumber, password }) => {
    if (!mobileNumber || !password) {
        throw {
            status: 400,
            message: "Mobile Number and password are required",
        };
    }

    const user = await User.findOne({ mobileNumber });
    if (!user) {
        throw {
            status: 401,
            message: "Invalid mobile number or password",
        };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw {
            status: 401,
            message: "Invalid mobile number or password",
        };
    }

    return {
        status: 200,
        message: "Login successful",
        data: {
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            mobileNumber: user.mobileNumber,
        },
    };
};

module.exports = { loginUserService };