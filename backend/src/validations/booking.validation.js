/**
 * validations/booking.validation.js
 *
 * WHY THIS FILE EXISTS:
 * The test drive form is public, so anyone can send anything to it. These
 * schemas define exactly what a valid booking looks like and give friendly
 * per-field messages the frontend can show under each input.
 *
 * Shared field rules (name, phone, email...) come from common.validation.js.
 * The same limits also exist as CHECK constraints in the SQL migration,
 * so the database is a second line of defence.
 */

const { z } = require("zod");
const { todayInBusinessTimeZone, addDays } = require("../utils/date");
const common = require("./common.validation");

// WHY export these lists: the service, the SQL migration and the admin API
// must all agree on the allowed values.
const TIME_SLOTS = ["morning", "afternoon", "evening"];
const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled"];
const MAX_DAYS_AHEAD = 60;

// POST /api/bookings
const createBookingBody = z
  .object({
    vehicle_id: common.vehicleId,
    customer_name: common.customerName,
    phone: common.indianPhone,
    email: common.optionalEmail,
    city: common.city,

    preferred_date: z
      .string({ required_error: "Preferred date is required" })
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
      // Reject impossible dates like 2026-02-31.
      .refine((v) => {
        const d = new Date(`${v}T00:00:00Z`);
        return !Number.isNaN(d.getTime()) && d.toISOString().startsWith(v);
      }, "Enter a real calendar date")
      // String comparison works because YYYY-MM-DD sorts like a date.
      .refine((v) => v >= todayInBusinessTimeZone(), "Preferred date cannot be in the past")
      .refine(
        (v) => v <= addDays(todayInBusinessTimeZone(), MAX_DAYS_AHEAD),
        `Bookings can be made up to ${MAX_DAYS_AHEAD} days ahead`
      ),

    preferred_time_slot: z.enum(TIME_SLOTS, {
      errorMap: () => ({ message: "Time slot must be morning, afternoon or evening" }),
    }),

    message: common.optionalText(500),
  })
  // WHY strict(): a customer must not be able to send { status: "confirmed" }
  // and approve their own booking. Unknown keys are rejected, not ignored.
  .strict();

// GET /api/bookings?status=pending&page=1&limit=20   (admin)
const listBookingsQuery = z.object({
  status: z.enum(BOOKING_STATUSES).optional(),
  ...common.pagination,
});

// /api/bookings/:id
const bookingIdParams = common.idParams;

// PATCH /api/bookings/:id/status   (admin)
const updateBookingStatusBody = z
  .object({ status: z.enum(BOOKING_STATUSES) })
  .strict();

module.exports = {
  TIME_SLOTS,
  BOOKING_STATUSES,
  createBookingBody,
  listBookingsQuery,
  bookingIdParams,
  updateBookingStatusBody,
};
