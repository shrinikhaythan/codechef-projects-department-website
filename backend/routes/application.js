// routes/application.js
const router = require("express").Router();
const Application = require("../models/Application");

router.get("/applications", async (req, res) => {
  const apps = await Application.find();
  res.json(apps);
});

router.delete("/applications/:id", async (req, res) => {
  await Application.findByIdAndDelete(req.params.id);
  res.json({ msg: "deleted" });
});

router.post("/applications", async (req, res) => {
  const app = await Application.create(req.body);
  res.json(app);
});

module.exports = router;