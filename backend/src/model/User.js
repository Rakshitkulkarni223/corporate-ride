const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const UserProfileSchema = require("./UserProfile");

const validatePhone = (value) =>
  validator.isMobilePhone(value, "any") && value.length <= 10;

const validatePassword = (value) =>
  /\d/.test(value) && /[a-zA-Z]/.test(value);

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email"],
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      validate: [validatePhone, "Invalid phone number"],
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      validate: [validatePassword, "Password must contain letters and numbers"],
    },

    refreshToken: { type: String },

    profile: UserProfileSchema,
  },
  { timestamps: true }
);

UserSchema.methods.isPasswordMatch = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

module.exports = mongoose.model("User", UserSchema);


// {
//   "firstName": "John",
//   "lastName": "Doe",
//   "email": "john@example.com",
//   "mobileNumber": "9876543210",
//   "password": "hashed_password",
//   "profile": {
//     "age": 28,
//     "gender": "Male",
//     "homeAddress": "123 Street",
//     "officeAddress": "456 Corporate Rd",
//     "avatar": "file_id",
//     "officeIdCardUrl": "file_id",
//     "personalIdCardUrl": "file_id"
//   }
// }
