const mongoose = require("mongoose");
require("dotenv").config();

const Car = require("../models/CarModel");
/**
 * Execution: node scripts/fixThumbnails.js
 * This script updates the thumbnail field for all car documents in the database.
 */
async function updateThumbnails() {
  await mongoose.connect(process.env.MONGO_CONNECTION_STRING);

  const cars = await Car.find();

  for (const car of cars) {
    car.thumbnail = car.images[0];
    await car.save();
    console.log(`Updated thumbnail for ${car.model}`);
  }

  process.exit(0);
}

updateThumbnails();
