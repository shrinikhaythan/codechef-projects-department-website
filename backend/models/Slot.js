const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  date: String,
  time: String
});

module.exports = mongoose.model("Slot", slotSchema);