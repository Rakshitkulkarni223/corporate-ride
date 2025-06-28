const { getBucket } = require("../database");
const User = require("../model/User");
const { postImageUpload } = require("../utils/handleImageUpload");

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


const updateUserDetails = async ({ userId, files, body }) => {
  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw {
      status: 404,
      message: "User not found.",
    };
  }

  const bucket = getBucket();
  const mobileNumber = existingUser.mobileNumber || "temp";
  const fields = ["avatar", "officeIdCardUrl", "personalIdCardUrl"];

  const { uploadedFiles, uploadedFileIds } = await postImageUpload(files, fields, mobileNumber);

  try {
    const profileUpdates = {
      ...(uploadedFiles.avatar && { avatar: uploadedFiles.avatar }),
      ...(uploadedFiles.officeIdCardUrl && { officeIdCardUrl: uploadedFiles.officeIdCardUrl }),
      ...(uploadedFiles.personalIdCardUrl && { personalIdCardUrl: uploadedFiles.personalIdCardUrl }),
      ...(body.age && { age: body.age }),
      ...(body.gender && { gender: body.gender }),
      ...(body.homeAddress && { homeAddress: body.homeAddress }),
      ...(body.officeAddress && { officeAddress: body.officeAddress }),
    };

    const userUpdates = {
      ...(body.firstName && { firstName: body.firstName }),
      ...(body.lastName && { lastName: body.lastName }),
      ...(Object.keys(profileUpdates).length && { profile: profileUpdates }),
    };

    await User.updateOne({ _id: userId }, { $set: userUpdates });

    return {
      status: 200,
      message: "Profile updated successfully",
      data: userUpdates,
    };
  } catch (err) {
    console.error("Profile update failed. Cleaning up uploaded files...", err);

    for (const fileId of uploadedFileIds) {
      try {
        await bucket.delete(fileId);
      } catch (delErr) {
        console.error(`Failed to delete file with id ${fileId}`, delErr);
      }
    }

    throw {
      status: 500,
      message: "Failed to update profile",
    };
  }
};

module.exports = { saveUserDetails, updateUserDetails };