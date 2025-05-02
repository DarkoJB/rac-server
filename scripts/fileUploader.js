const fs = require("fs/promises");
const path = require("path");

const uploadFiles = async (uploadedImages, category) => {
  // Ensure we always work with an array
  const imagesArray = Array.isArray(uploadedImages)
    ? uploadedImages
    : [uploadedImages];
  const results = [];
  const imagesDir = path.join(__dirname, "..", "uploads", category);

  try {
    // Create directory if it doesn't exist
    await fs.mkdir(imagesDir, { recursive: true });

    for (const image of imagesArray) {
      try {
        if (!image.originalFilename) {
          results.push({
            isError: true,
            statusCode: 400,
            statusMessage: "No image name provided",
            imageUrl: null,
            originalFilename: null,
          });
          continue;
        }

        const imagePath = path.join(imagesDir, image.originalFilename);
        const data = await fs.readFile(image.filepath);
        await fs.writeFile(imagePath, data);

        const publicImageUrl = `/uploads/${category}/${encodeURIComponent(
          image.originalFilename
        )}`;

        results.push({
          isError: false,
          statusCode: 200,
          statusMessage: "Image uploaded successfully",
          imageUrl: publicImageUrl,
          originalFilename: image.originalFilename,
        });
      } catch (error) {
        results.push({
          isError: true,
          statusCode: 500,
          statusMessage: `Error uploading ${
            image.originalFilename || "unknown file"
          }`,
          imageUrl: null,
          originalFilename: image.originalFilename || null,
        });
      }
    }

    return results;
  } catch (error) {
    // If directory creation fails
    return [
      {
        isError: true,
        statusCode: 500,
        statusMessage: "Error creating upload directory",
        imageUrl: null,
        originalFilename: null,
      },
    ];
  }
};

// Single file upload convenience function
const uploadFile = async (uploadedImage, category = "uploads") => {
  const [result] = await uploadFiles([uploadedImage], category);
  return result;
};

module.exports = {
  uploadFile,
  uploadFiles,
};
