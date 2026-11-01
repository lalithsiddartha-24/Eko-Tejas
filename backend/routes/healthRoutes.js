const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  return res.json({
    success: true,
    status: "ok",
    service: "ekotejas-backend",
  });
});

module.exports = router;
