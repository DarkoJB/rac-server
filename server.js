const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors()); // Allow React to connect
app.use(express.json()); // Parse JSON requests
app.use("/uploads", express.static("uploads"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Add these BEFORE routes (after mongoose.connect)
require("./models/UserModel"); // This initializes the User model
require("./models/CarModel");
require("./models/BookingModel");

const carRoutes = require("./routes/carsRoute");
const userRoutes = require("./routes/usersRoute");

app.use("/api/cars", carRoutes); // Car routes
app.use("/api/users", userRoutes); // User routes

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
