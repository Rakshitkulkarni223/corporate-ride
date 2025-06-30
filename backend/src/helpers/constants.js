const GENDER = Object.freeze({
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
});

const UPLOADS_FOLDER = 'uploads';

const REFRESH_TOKEN_EXPIRES = parseInt(process.env.REFRESH_TOKEN_EXPIRES)
const ACCESS_TOKEN_EXPIRES = parseInt(process.env.ACCESS_TOKEN_EXPIRES)

const RIDE_OFFER_STATUS = Object.freeze({
  ACTIVE: "Active",
  COMPLETED: "Completed"
});

const RIDE_TYPE = Object.freeze({
  DEPARTURE: "Departure",
  RETURN: "Return"
});

const RIDE_REQUEST_STATUS = Object.freeze({
  SENT: "Sent",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected"
});

module.exports = {
  GENDER,
  UPLOADS_FOLDER,
  REFRESH_TOKEN_EXPIRES,
  ACCESS_TOKEN_EXPIRES,
  RIDE_OFFER_STATUS,
  RIDE_TYPE,
  RIDE_REQUEST_STATUS
};