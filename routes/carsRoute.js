const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const CarsController = require("../controllers/CarsController"); // Import the CarsController
// GET all cars
router.get("/", CarsController.getCars);

// POST a new car
router.post("/", upload.array("images", 5), CarsController.createCar);

// DELETE a car
router.delete("/:id", CarsController.deleteCar);

// PATCH a car
router.patch("/:id", upload.array("images", 5), CarsController.updateCar);

// SEARCH cars
router.get("/search", CarsController.searchCars);

module.exports = router; // Export the router to use in server.js
