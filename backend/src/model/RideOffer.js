const mongoose = require("mongoose");
const { RIDE_OFFER_STATUS, RIDE_TYPE } = require("../helpers/constants");

const RideOfferSchema = new mongoose.Schema({
  pickupLocation: {
    type: String,
    required: true,
    trim: true,
  },
  dropLocation: {
    type: String,
    required: true,
    trim: true,
  },
  rideDateTime: {
    type: Date,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  type: {
    type: String,
    enum: Object.values(RIDE_TYPE),
    required: true,
    default: RIDE_TYPE.DEPARTURE,
  },
  status: {
    type: String,
    enum: Object.values(RIDE_OFFER_STATUS),
    required: true,
    default: RIDE_OFFER_STATUS.ACTIVE
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("RideOffer", RideOfferSchema);