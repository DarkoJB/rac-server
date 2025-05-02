const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  name: String,
  contentType: String,
  data: Buffer,
});

module.exports = mongoose.model("Image", imageSchema);
