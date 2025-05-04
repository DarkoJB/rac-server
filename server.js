require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Same setup as index.js
const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// MongoDB
mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.info("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Models
require("./models/UserModel");
require("./models/CarModel");
require("./models/BookingModel");

// Routes
const carRoutes = require("./routes/carsRoute");
const userRoutes = require("./routes/usersRoute");

app.use("/cars", carRoutes);
app.use("/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Local server running on port ${PORT}`);
});
