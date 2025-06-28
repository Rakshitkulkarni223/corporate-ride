const mongoose = require("mongoose");
const { Gender } = require("../helpers/constants");

const UserProfileSchema = new mongoose.Schema(
  {
    age: {
      type: Number,
      min: [18, "Minimum age is 18"],
      max: [65, "Maximum age is 65"],
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    homeAddress: { type: String },
    officeAddress: { type: String },
    officeIdCardUrl: { type: String },
    personalIdCardUrl: { type: String },
    avatar: { type: String },
  },
  { _id: false }
);

module.exports = UserProfileSchema;
