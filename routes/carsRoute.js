const express = require("express");
const router = express.Router();
const { uploadFiles } = require("../scripts/fileUploader");
const removeFile = require("../scripts/fileRemover");
const Car = require("../models/CarModel"); // Import the Car model

const { IncomingForm } = require("formidable");

// Must go BEFORE your routes
const multipartMiddleware = (req, res, next) => {
  const form = new IncomingForm({ multiples: true, keepExtensions: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("Formidable error:", err);
      return res.status(400).json({ message: "Invalid form data" });
    }

    req.body = fields;
    req.files = files;
    next();
  });
};

// GET all cars
router.get("/", async (request, response) => {
  try {
    const limit = parseInt(request.query.limit, 10) || 0; // Default to 0 (no limit)
    const cars = await Car.find().limit(limit).populate("owner", "username");
    response.status(200).json(cars);
  } catch (err) {
    const message = `GET:500 Failed to GET cars: ${err.message}`;
    console.error(message);
    response.status(500).json({ message });
  }
});

// POST a new car
router.post("/", multipartMiddleware, async (request, response) => {
  // Sanitize the data - formidable converts them to arrays beforehand as a part of type-safety
  const model = Array.isArray(request.body.model)
    ? request.body.model[0]
    : request.body.model;
  const year = Array.isArray(request.body.year)
    ? parseInt(request.body.year[0], 10)
    : parseInt(request.body.year, 10);
  const seats = Array.isArray(request.body.seats)
    ? parseInt(request.body.seats[0], 10)
    : parseInt(request.body.seats, 10);
  const pricePerDay = Array.isArray(request.body.pricePerDay)
    ? parseFloat(request.body.pricePerDay[0])
    : parseFloat(request.body.pricePerDay);
  const owner = Array.isArray(request.body.owner)
    ? request.body.owner[0]
    : request.body.owner;

  const imageUploadStatusObj = await uploadFiles(request.files.images, "cars");
  const images = imageUploadStatusObj.map((img) => img.imageUrl);
  const car = new Car({
    model,
    year,
    seats,
    pricePerDay,
    owner,
    images,
    thumbnail: images[0],
  });

  try {
    const newCar = await car.save();
    response.status(201).json(newCar);
  } catch (err) {
    const message = `POST:400 Failed to POST a new car: ${err.message}`;
    console.error(message);
    response.status(400).json({ message });
  }
});

// DELETE a car
router.delete("/:id", async (request, response) => {
  try {
    const car = await Car.findById(request.params.id);
    if (!car) {
      return response.status(404).json({ message: "Car not found" });
    }

    await removeFile(car.images, "cars");
    await Car.findByIdAndDelete(request.params.id);
    response.status(200).json({ success: true });
  } catch (error) {
    const message = `POST:400 Failed to DELETE a new car: ${err.message}`;
    console.error(message);
    response.status(400).json({ message });
  }
});

module.exports = router; // Export the router to use in server.js
