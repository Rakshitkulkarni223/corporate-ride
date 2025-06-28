const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { Gender } = require('../helpers/constants');

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required."],
    },
    age: {
      type: Number,
      required: [true, "Age is required."],
      min: [18, "Minimum age is 18"],
      max: [65, "Maximum age is 65"],
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: [true, "Gender is required."],
    },
    homeAddress: {
      type: String,
      required: [true, "Home address is required."],
    },
    officeAddress: {
      type: String,
      required: [true, "Office address is required."],
    },
    officeIdCardUrl: {
      type: String,
      required: [true, "Office ID card is required."],
    },
    personalIdCardUrl: {
      type: String,
      required: [true, "Personal ID card (Aadhar/PAN) is required."],
    },
    avatar: {
      type: String,
      required: [true, "Profile picture is required."],
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required."],
      unique: [true, "Mobile number already exists. Please use a different number."],
      validate: {
        validator: function (value) {
          return validator.isMobilePhone(value, "any") && value.length <= 10;
        },
        message: "Invalid phone number.",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: [true, "Email already exists. Please use a different email."],
      trim: true,
      lowercase: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Invalid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minlength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: function (value) {
          return /\d/.test(value) && /[a-zA-Z]/.test(value);
        },
        message: "Password must contain at least one letter and one number",
      },
    },
  },
  { timestamps: true }
);


UserSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);