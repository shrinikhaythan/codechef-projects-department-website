const router = require("express").Router();
const Booking = require("../models/Booking");

// ADD booking
router.post("/bookings", async (req, res) => {
  const booking = await Booking.create(req.body);
  res.json(booking);
});

// GET bookings
router.get("/bookings", async (req, res) => {
  const bookings = await Booking.find();
  res.json(bookings);
});

module.exports = router;