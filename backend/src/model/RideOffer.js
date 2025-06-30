const mongoose = require("mongoose");

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