const GENDER = Object.freeze({
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
});

const UPLOADS_FOLDER = 'uploads';

const REFRESH_TOKEN_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES
const ACCESS_TOKEN_EXPIRES = process.env.ACCESS_TOKEN_EXPIRES

module.exports = {
  GENDER,
  UPLOADS_FOLDER,
  REFRESH_TOKEN_EXPIRES,
  ACCESS_TOKEN_EXPIRES
};