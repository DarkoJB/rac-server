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

// carSchema.pre("save", function (next) {
//   if (this.isModified("images") && this.images.length > 0) {
//     this.thumbnail = this.images[0]; // Set the thumbnail to the first image in the array
//   }
//   next();
// });

module.exports = mongoose.model("Car", carSchema);
