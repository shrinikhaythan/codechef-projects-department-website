// routes/member.js
const router = require("express").Router();
const Member = require("../models/Member");

router.post("/members", async (req, res) => {
  const m = await Member.create(req.body);
  res.json(m);
});

router.get("/members", async (req, res) => {
  const m = await Member.find();
  res.json(m);
});

router.delete("/members/:id", async (req, res) => {
  await Member.findByIdAndDelete(req.params.id);
  res.json({ msg: "deleted" });
});

module.exports = router;