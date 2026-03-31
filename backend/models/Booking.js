const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  email: String,
  date: String,
  time: String
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);