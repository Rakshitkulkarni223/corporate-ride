const User = require("../model/User");

const saveUserDetails = async (userObj) => {
    const { mobileNumber } = userObj;

    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      throw {
        status: 400,
        message: "Mobile number already registered.",
      };
    }

    const newUser = new User({
      ...userObj
    });

    await newUser.save();

    return {
      status: 201,
      message: "User registered successfully!",
      data: newUser,
    };
};

module.exports = { saveUserDetails };