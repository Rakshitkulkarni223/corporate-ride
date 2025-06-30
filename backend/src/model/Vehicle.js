const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  model: {
    type: String,
    required: true,
    trim: true,
  },
  number: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  image: {
    type: String,
    required: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true
});

module.exports = mongoose.model("Vehicle", VehicleSchema);
