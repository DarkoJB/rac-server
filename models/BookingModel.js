const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Booking must belong to a user"],
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: [true, "Booking must have a car"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Start date must be in the future",
      },
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },
    totalPrice: {
      type: Number,
      min: [0, "Price cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Calculate total price before saving
bookingSchema.pre("save", async function (next) {
  if (!this.isModified("startDate") && !this.isModified("endDate"))
    return next();

  const car = await mongoose.model("Car").findById(this.car);
  const days = Math.ceil(
    (this.endDate - this.startDate) / (1000 * 60 * 60 * 24)
  );
  this.totalPrice = car.pricePerDay * days;

  next();
});

// Prevent double bookings
bookingSchema.index({ car: 1, startDate: 1, endDate: 1 }, { unique: true });
module.exports = mongoose.model("Booking", bookingSchema);
