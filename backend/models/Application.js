// models/Application.js
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  semester: String,
  role: String,
  skills: String,
  experience: String,
  portfolio: String
}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);