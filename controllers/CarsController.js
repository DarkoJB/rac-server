const Car = require("../models/CarModel");

// GET all cars
exports.getCars = async (request, response) => {
  try {
    const limit = parseInt(request.query.limit, 10) || 0; // Default to 0 (no limit)
    const cars = await Car.find().limit(limit).populate("owner", "username");
    response.status(200).json(cars);
  } catch (err) {
    const message = `GET:500 Failed to GET cars: ${err.message}`;
    console.error(message);
    response.status(500).json({ message });
  }
};

// POST a new car
exports.createCar = async (request, response) => {
  try {
    const { model, year, seats, pricePerDay, owner } = request.body;

    // Process uploaded files
    const images = request.files.map((file) => ({
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
    response.status(201).json(savedCar);
  } catch (err) {
    const message = `POST:400 Failed to POST car: ${err}`;
    console.error(message);
    response.status(400).json({ message });
  }
};

// DELETE a car
exports.deleteCar = async (request, response) => {
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
};

// PATCH a car
exports.updateCar = async (request, response) => {
  try {
    const {
      model,
      year,
      seats,
      pricePerDay,
      owner,
      retainImageIds,
      thumbnailId,
    } = request.body;

    const car = await Car.findById(request.params.id);

    if (!car) {
      return res.status(404).json({ message: "Car not found" });
    }

    // Update basic fields if provided
    if (model !== undefined) car.model = model;
    if (year !== undefined) car.year = parseInt(year);
    if (seats !== undefined) car.seats = parseInt(seats);
    if (pricePerDay !== undefined) car.pricePerDay = parseFloat(pricePerDay);
    if (owner !== undefined) car.owner = owner;

    // Parse retained image IDs if provided
    let retainedImages = [];
    if (retainImageIds) {
      const ids = JSON.parse(retainImageIds); // expects JSON array of _id strings
      retainedImages = car.images.filter((img) =>
        ids.includes(String(img._id))
      );
    }

    // Process new uploaded images
    const newImages = request.files.map((file) => ({
      data: file.buffer,
      contentType: file.mimetype,
    }));

    // Combine retained + new
    const combinedImages = [...retainedImages, ...newImages];
    car.images = combinedImages;

    // Set thumbnail
    if (thumbnailId) {
      const match =
        combinedImages.find((img) => String(img._id) === thumbnailId) ||
        newImages.find((img) => !img._id && thumbnailId === "new");
      if (match) {
        car.thumbnail = match;
      }
    } else if (combinedImages.length > 0) {
      car.thumbnail = combinedImages[0]; // default fallback
    } else {
      car.thumbnail = null;
    }

    const updatedCar = await car.save();

    response.status(200).json(updatedCar);
  } catch (error) {
    const message = `PATCH:400 Failed to UPDATE a new car: ${error.message}`;
    console.error(message);
    response.status(400).json({ message });
  }
};

// SEARCH cars
exports.searchCars = async (request, response) => {
  console.log("Search query:", request.query);
  try {
    // Query parameter for search
    const searchQuery = request.query.cars || "";

    // Try parsing numeric values
    const numericQuery = parseFloat(searchQuery);
    const isNumeric = !isNaN(numericQuery);

    const conditions = [];

    // Search by model
    conditions.push({ model: new RegExp(searchQuery, "i") });
    if (isNumeric) {
      conditions.push({ year: numericQuery });
      conditions.push({ seats: numericQuery });
      conditions.push({ pricePerDay: numericQuery });
    }

    const foundCars = await Car.find({ $or: conditions }).populate(
      "owner",
      "username"
    );

    if (!foundCars || foundCars.length === 0) {
      throw new Error("No cars found matching the search criteria");
    }

    response.status(200).json(foundCars);
  } catch (error) {
    const message = `GET:500 Failed to SEARCH cars: ${error.message}`;
    console.error(message);
    response.status(400).json({ message });
  }
};
