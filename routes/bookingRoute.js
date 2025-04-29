const express = require("express");
const router = express.Router();

const Booking = require("../models/BookingModel");

// GET all bookings for a user
router.get("/bookings", async (request, response) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(request.user.id)) {
      return response.status(400).json({ error: "Invalid user ID format" });
    }
    const bookings = await Booking.find({ user: request.user.id })
      .populate({
        path: "car",
        select: "model pricePerDay photos",
        match: { active: true },
      }) // Only populate active cars
      .sort({ startDate: 1 }); // Sort by upcoming bookings first;
    response.status(200).json(bookings);
  } catch (err) {
    const message = `GET:500 Failed to GET booking: ${err.message}`;
    console.error(message);
    response.status(500).json({ message });
  }
});

// POST a new booking
router.post("/bookings", async (request, response) => {
  try {
    const booking = await Booking.create({
      user: request.user.id,
      car: request.body.carId,
      startDate: request.body.startDate,
      endDate: request.body.endDate,
    });
    response.status(201).json(booking);
  } catch (err) {
    const message = `POST:400 Failed to POST a new booking: ${err.message}`;
    console.error(message);
    response.status(400).json({
      message,
    });
  }
});
