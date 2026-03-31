const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String,
  group: String,
  tenure: String,
  linkedin: String,
  github: String,
  photo: String
}, { timestamps: true });

module.exports = mongoose.model("Member", memberSchema);