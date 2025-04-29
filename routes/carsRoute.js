const express = require("express");
const router = express.Router();

const Car = require("../models/CarModel"); // Import the Car model

// GET all cars
router.get("/", async (request, response) => {
  try {
    const limit = parseInt(request.query.limit, 10) || 0; // Default to 0 (no limit)
    const cars = await Car.find().limit(limit);
    response.status(200).json(cars);
  } catch (err) {
    const message = `GET:500 Failed to GET cars: ${err.message}`;
    console.error(message);
    response.status(500).json({ message });
  }
});

// POST a new car
router.post("/", async (request, response) => {
  const car = new Car({
    model: request.body.model,
    year: request.body.year,
    seats: request.body.seats,
    pricePerDay: request.body.pricePerDay,
    owner: request.body.owner,
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

module.exports = router; // Export the router to use in server.js
