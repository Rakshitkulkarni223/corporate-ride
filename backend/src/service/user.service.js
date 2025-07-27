const { getBucket } = require("../database");
const User = require("../model/User");
const Vehicle = require("../model/Vehicle");
const checkUserAccess = require("../utils/checkAccess");
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

  const userWithoutPassword = newUser.toObject();
  delete userWithoutPassword.password;

  return {
    status: 201,
    message: "User registered successfully!",
    data: userWithoutPassword,
  };
};

const toggleOfferingStatusService = async ({ userId, loggedInUserId }) => {
  checkUserAccess(userId, loggedInUserId);

  const user = await User.findById(userId);
  if (!user) {
    throw {
      status: 404,
      message: "User not found.",
    };
  }
  user.isOfferingRides = !user.isOfferingRides;
  await user.save();

  return {
    status: 200,
    message: `Ride offering ${user.isOfferingRides ? "enabled" : "disabled"}.`,
    data: { isOfferingRides: user.isOfferingRides },
  };
}

const uploadDocumentsService = async ({ userId, files, loggedInUserId }) => {
  checkUserAccess(userId, loggedInUserId);

  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw {
      status: 404,
      message: "User not found.",
    };
  }

  const bucket = getBucket();
  const mobileNumber = existingUser.mobileNumber || "temp";
  const fields = ["officeIdCardUrl", "personalIdCardUrl"];

  const { uploadedFiles, uploadedFileIds } = await postImageUpload(files, fields, mobileNumber);

  try {
    const profileUpdates = {
      ...(uploadedFiles.officeIdCardUrl && { officeIdCardUrl: uploadedFiles.officeIdCardUrl }),
      ...(uploadedFiles.personalIdCardUrl && { personalIdCardUrl: uploadedFiles.personalIdCardUrl }),
    };

    const userUpdates = {
      ...(Object.keys(profileUpdates).length && { profile: profileUpdates }),
    };

    await User.updateOne({ _id: userId }, { $set: userUpdates });

    return {
      status: 200,
      message: "Documents uploaded successfully",
      data: userUpdates,
    };
  } catch (err) {
    console.error("Documents upload failed. Cleaning up uploaded files...", err);

    for (const fileId of uploadedFileIds) {
      try {
        await bucket.delete(fileId);
      } catch (error) {
        console.error(`Failed to delete file with id ${fileId}`, error);
      }
    }

    throw {
      status: 500,
      message: "Failed to upload documents",
    };
  }
};

const updateAvatarService = async ({ userId, files, loggedInUserId }) => {
  checkUserAccess(userId, loggedInUserId)

  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw {
      status: 404,
      message: "User not found.",
    };
  }

  const bucket = getBucket();
  const mobileNumber = existingUser.mobileNumber || "temp";
  const fields = ["avatar"];

  const { uploadedFiles, uploadedFileIds } = await postImageUpload(files, fields, mobileNumber);

  try {
    const profileUpdates = {
      ...(uploadedFiles.avatar && { avatar: uploadedFiles.avatar }),
    };

    const userUpdates = {
      ...(Object.keys(profileUpdates).length && { profile: profileUpdates }),
    };

    await User.updateOne({ _id: userId }, { $set: userUpdates });

    return {
      status: 200,
      message: "Avatar updated successfully",
      data: userUpdates,
    };
  } catch (err) {
    console.error("Avatar update failed. Cleaning up uploaded files...", err);

    for (const fileId of uploadedFileIds) {
      try {
        await bucket.delete(fileId);
      } catch (error) {
        console.error(`Failed to delete file with id ${fileId}`, error);
      }
    }

    throw {
      status: 500,
      message: "Failed to update avatar",
    };
  }
};

const updateUserDetails = async ({ userId, files, body, loggedInUserId }) => {
  checkUserAccess(userId, loggedInUserId)

  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw {
      status: 404,
      message: "User not found.",
    };
  }

  try {
    const profileUpdates = {
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

    throw {
      status: 500,
      message: "Failed to update profile",
    };
  }
};


const getUserDetails = async ({ userId, loggedInUserId }) => {
  checkUserAccess(userId, loggedInUserId);

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
    data: { ...user },
  };

}

const deleteAvatarService = async ({ userId, loggedInUserId }) => {
  checkUserAccess(userId, loggedInUserId)

  const existingUser = await User.findById(userId);
  if (!existingUser) {
    throw {
      status: 404,
      message: "User not found.",
    };
  }

  try {
    const profileUpdates = {
      ...(existingUser.profile?.avatar && { avatar: "" }),
    };

    const userUpdates = {
      ...(Object.keys(profileUpdates).length && { profile: profileUpdates }),
    };

    await User.updateOne({ _id: userId }, { $set: userUpdates });

    return {
      status: 200,
      message: "Avatar deleted successfully",
      data: userUpdates,
    };
  } catch (err) {
    console.error("Avatar delete failed. Cleaning up uploaded files...", err);

    throw {
      status: 500,
      message: "Failed to delete avatar",
    };
  }
};

const getUserProfileDetails = async ({ userId, loggedInUserId }) => {
  checkUserAccess(userId, loggedInUserId);

  const user = await User.findById(userId).select("firstName lastName email mobileNumber isOfferingRides profile");
  if (!user) {
    throw {
      status: 404,
      message: "User not found",
    };
  }

  const vehicle = await Vehicle.findOne({ owner: userId }).select("model number image");

  return {
    status: 200,
    message: "Profile fetched successfully",
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      isOfferingRides: user.isOfferingRides,
      profile: {
        age: user.profile?.age || null,
        gender: user.profile?.gender || null,
        homeAddress: user.profile?.homeAddress || null,
        officeAddress: user.profile?.officeAddress || null,
        avatar: user.profile?.avatar || null,
        officeIdCardUrl: user.profile?.officeIdCardUrl || null,
        personalIdCardUrl: user.profile?.personalIdCardUrl || null,
      },
      vehicle: vehicle
        ? {
          model: vehicle.model,
          number: vehicle.number,
          image: vehicle.image || null,
        }
        : null,
    }
  };

}

module.exports = {
  saveUserDetails,
  updateUserDetails,
  getUserDetails, getUserProfileDetails,
  toggleOfferingStatusService, uploadDocumentsService, updateAvatarService,
  deleteAvatarService
};