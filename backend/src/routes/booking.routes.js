/**
 * routes/booking.routes.js
 *
 * WHY THIS FILE EXISTS:
 * Shows at a glance who may call what, and which checks run first.
 * Order in each line = order Express runs them:
 *   authenticate -> requireRole -> validate -> controller
 *
 * Mounted at /api/bookings in routes/index.js.
 */

const { Router } = require("express");
const validate = require("../middlewares/validation.middleware");
const { authenticate, requireRole } = require("../middlewares/auth.middleware");
const {
  createBookingBody,
  listBookingsQuery,
  bookingIdParams,
  updateBookingStatusBody,
} = require("../validations/booking.validation");
const bookingController = require("../controllers/booking.controller");

const router = Router();

// PUBLIC: any visitor can book a test drive (no login needed).
router.post("/", validate({ body: createBookingBody }), bookingController.createBooking);

// ADMIN ONLY: customer phone numbers are private.
// WHY auth BEFORE validation: don't waste work (or reveal what's valid)
// for someone who isn't allowed in at all.
const adminOnly = [authenticate, requireRole("admin")];

router.get("/", ...adminOnly, validate({ query: listBookingsQuery }), bookingController.listBookings);
router.get("/:id", ...adminOnly, validate({ params: bookingIdParams }), bookingController.getBooking);
router.patch(
  "/:id/status",
  ...adminOnly,
  validate({ params: bookingIdParams, body: updateBookingStatusBody }),
  bookingController.updateBookingStatus
);

module.exports = router;
