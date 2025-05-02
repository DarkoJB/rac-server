const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/UserModel");

// GET all users
router.get("/", async (request, response) => {
  try {
    const users = await User.find().select("-password"); // Exclude password from the response
    response.status(200).json(users);
  } catch (err) {
    const message = `GET:500 Failed to GET users: ${err.message}`;
    console.error(message);
    response.status(500).json({ message });
  }
});

// GET user by id
router.get("/:id", async (request, response) => {
  try {
    const user = await User.findById(request.params.id).select("-password"); // Exclude password from the response
    response.status(200).json(user);
  } catch (err) {
    const message = `GET:500 Failed to GET users: ${err.message}`;
    console.error(message);
    response.status(500).json({ message });
  }
});

// POST a new user
router.post(
  "/",
  [
    body("username")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("role").isIn(["renter", "owner"]).withMessage("Invalid role"),
  ],
  async (request, response) => {
    const { username, password, role, email } = request.body;

    try {
      // Check if user exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return response.status(400).json({ error: "Username already exists" });
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });

      // Return user without password
      const userToReturn = { ...newUser.toObject() };
      delete userToReturn.password;

      response.status(201).json(userToReturn);
    } catch (err) {
      const message = `POST:400 Failed to POST a new user: ${err.message}`;
      console.error(message);
      response.status(400).json({ message });
    }
  }
);

module.exports = router; // Export the router to use in server.js
