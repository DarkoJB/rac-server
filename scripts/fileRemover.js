const fs = require("fs/promises");
const path = require("path");

const removeFile = async (images, category) => {
  const imagesDir = path.join(__dirname, "..", "uploads", category);
  if (!images) return;
  try {
    for (const image of images) {
      const imageFilename = decodeURIComponent(image.split("/").pop());
      const imagePath = path.join(imagesDir, imageFilename);

      // Delete the image file
      await fs.unlink(imagePath); // This deletes the file at the imagePath
    }
  } catch (error) {
    // Ignore file-not-found errors, but log others
    if (error.code !== "ENOENT") {
      console.error("Error removing file:", error);
    }
  }
};

module.exports = removeFile;
