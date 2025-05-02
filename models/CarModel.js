const mongoose = require("mongoose");

const carSchema = new mongoose.Schema({
  model: { type: String, required: true },
  year: Number,
  seats: { type: Number, min: 2 },
  pricePerDay: { type: Number, min: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  images: [String],
  thumbnail: String,
});

module.exports = mongoose.model("Car", carSchema);
