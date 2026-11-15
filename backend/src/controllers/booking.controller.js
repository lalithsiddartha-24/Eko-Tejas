/**
 * controllers/booking.controller.js
 *
 * WHY THIS FILE EXISTS:
 * The thin front desk for bookings: validated input in, service call,
 * ApiResponse out. No Supabase, no try/catch, no business rules.
 */

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const bookingService = require("../services/booking.service");

// POST /api/bookings   (public: customer books a test drive)
const createBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.createBooking(req.body);
  // 201 Created = a new resource now exists (vs. 200 OK for reads)
  new ApiResponse(201, booking, "Test drive booked! Our team will call you to confirm.").send(res);
});

// GET /api/bookings   (admin)
const listBookings = asyncHandler(async (req, res) => {
  const result = await bookingService.listBookings(req.validatedQuery);
  new ApiResponse(200, result, "Bookings fetched").send(res);
});

// GET /api/bookings/:id   (admin)
const getBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.getBookingById(req.params.id);
  new ApiResponse(200, booking, "Booking fetched").send(res);
});

// PATCH /api/bookings/:id/status   (admin)
const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await bookingService.updateBookingStatus(req.params.id, req.body.status);
  new ApiResponse(200, booking, `Booking marked as ${booking.status}`).send(res);
});

module.exports = { createBooking, listBookings, getBooking, updateBookingStatus };
