const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
});

const carSchema = new mongoose.Schema({
  model: { type: String, required: true },
  year: Number,
  seats: { type: Number, min: 2 },
  pricePerDay: { type: Number, min: 0 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  images: [imageSchema],
  thumbnail: { type: imageSchema },
});

carSchema.virtual("imageUrls").get(function () {
  return this.images.map((image) => ({
    _id: image._id,
    url: `data:${image.contentType};base64,${image.data.toString("base64")}`,
  }));
});

// Ensure virtuals are included when converting to JSON
carSchema.set("toJSON", { virtuals: true });
carSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Car", carSchema);
