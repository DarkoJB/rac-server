const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http");

require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowedOrigins.includes(req.header("Origin"))) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions);
};

app.use(cors(corsOptionsDelegate)); // Allow React to connect
app.use(express.json()); // Parse JSON requests
app.use("/uploads", express.static("uploads"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.info("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

/** MODELS */
require("./models/UserModel"); // This initializes the User model
require("./models/CarModel");
require("./models/BookingModel");

/** ROUTES */
const carRoutes = require("./routes/carsRoute");
const userRoutes = require("./routes/usersRoute");

app.use("/api/cars", carRoutes); // Car routes
app.use("/api/users", userRoutes); // User routes

// app.listen(PORT, () => console.info(`Server running on port ${PORT}`));
module.exports = serverless(app);
