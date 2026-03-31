const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ FIRST: middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ THEN: routes


const memberRoutes = require("./routes/member");
const slotRoutes = require("./routes/slot");
const appRoutes = require("./routes/application");
const bookingRoutes = require("./routes/booking");
const authRoutes = require("./routes/auth");


app.use("/api", memberRoutes);
app.use("/api", slotRoutes);
app.use("/api", appRoutes);
app.use("/api", bookingRoutes);
app.use("/api", authRoutes);
// 🔥 MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => {
    console.log("❌ MongoDB Error:");
    console.log(err.message);
  });

// test route
app.get("/", (req, res) => {
  res.send("Backend is alive");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});