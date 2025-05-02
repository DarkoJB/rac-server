const mongoose = require("mongoose");
require("dotenv").config();

const Car = require("../models/CarModel");
/**
 * Execution: node scripts/fixImagesPath.js
 * This script updates the images path field for all car documents in the database.
 */
async function updateImagePaths() {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION_STRING);

    const cars = await Car.find();
    let updatedCount = 0;

    for (const car of cars) {
      let needsUpdate = false;
      const updatedImages = [];

      // Process each image path
      for (const image of car.images) {
        if (image && typeof image === "string") {
          // Extract filename from path (handles different path formats)
          const filename = image.split("/").pop();

          // Create new path in correct format
          const newPath = `/uploads/cars/${filename}`;

          // Only update if path doesn't already match our desired format
          if (image !== newPath) {
            updatedImages.push(newPath);
            needsUpdate = true;
          } else {
            updatedImages.push(image);
          }
        } else {
          // Keep non-string or invalid image entries as-is
          updatedImages.push(image);
        }
      }

      // Update thumbnail to first image if it exists
      const newThumbnail = updatedImages.length > 0 ? updatedImages[0] : null;
      const thumbnailNeedsUpdate = car.thumbnail !== newThumbnail;

      // Only save if changes are needed
      if (needsUpdate || thumbnailNeedsUpdate) {
        car.images = updatedImages;
        car.thumbnail = newThumbnail;
        await car.save();
        updatedCount++;
        console.info(`Updated paths for ${car.model}`);
      }
    }

    console.info(`\nUpdate complete. ${updatedCount} cars modified.`);
  } catch (error) {
    console.error("Error updating image paths:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updateImagePaths();
