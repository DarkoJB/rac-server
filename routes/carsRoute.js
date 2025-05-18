const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const Car = require("../models/CarModel"); // Import the Car model

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
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const { model, year, seats, pricePerDay, owner } = req.body;

    // Process uploaded files
    const images = req.files.map((file) => ({
      data: file.buffer,
      contentType: file.mimetype,
    }));

    // Create new car
    const car = new Car({
      model,
      year: parseInt(year),
      seats: parseInt(seats),
      pricePerDay: parseFloat(pricePerDay),
      owner,
      images,
      thumbnail: images[0], // Use first image as thumbnail
    });

    const savedCar = await car.save();
    res.status(201).json(savedCar);
  } catch (err) {
    const message = `POST:400 Failed to POST car: ${err}`;
    console.error(message);
    res.status(400).json({ message });
  }
});

// DELETE a car
router.delete("/:id", async (request, response) => {
  try {
    const car = await Car.findById(request.params.id);
    if (!car) {
      return response.status(404).json({ message: "Car not found" });
    }

    await Car.findByIdAndDelete(request.params.id);
    response.status(200).json({ success: true });
  } catch (error) {
    const message = `DELETE:400 Failed to DELETE a new car: ${err.message}`;
    console.error(message);
    response.status(400).json({ message });
  }
});

module.exports = router; // Export the router to use in server.js
