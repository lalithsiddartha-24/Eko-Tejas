/**
 * routes/index.js
 *
 * WHY THIS FILE EXISTS:
 * A single "table of contents" for the whole API. app.js mounts this once at
 * /api, and every feature router plugs in here. To see every endpoint the
 * backend offers, you only need to open this file.
 *
 * ONLY routing here. No logic, no database.
 */

const { Router } = require("express");

const router = Router();

// Health check: lets us (and Vercel) confirm the server is alive
// without touching the database.
router.get("/health", (req, res) => {
  res.json({ success: true, message: "Eko Tejas API is running", data: null });
});

// Feature routers get added here module by module:
router.use("/vehicles", require("./vehicle.routes"));       // Module 2
router.use("/bookings", require("./booking.routes"));       // Module 3
router.use("/enquiries", require("./enquiry.routes"));      // Module 4

module.exports = router;
