// routes/slot.js
const router = require("express").Router();
const Slot = require("../models/Slot");

router.post("/slots", async (req, res) => {
  const s = await Slot.create(req.body);
  res.json(s);
});

router.get("/slots", async (req, res) => {
  const s = await Slot.find();
  res.json(s);
});

router.delete("/slots/:id", async (req, res) => {
  await Slot.findByIdAndDelete(req.params.id);
  res.json({ msg: "deleted" });
});

module.exports = router;