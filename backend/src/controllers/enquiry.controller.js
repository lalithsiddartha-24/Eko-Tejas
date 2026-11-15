/**
 * controllers/enquiry.controller.js
 *
 * WHY THIS FILE EXISTS:
 * Thin front desk for enquiries: validated input in, service call,
 * ApiResponse out. No Supabase, no try/catch, no business rules.
 */

const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const enquiryService = require("../services/enquiry.service");

const THANK_YOU = "Thank you! Our team will get back to you within 24 hours.";

// POST /api/enquiries   (public)
const createEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.createEnquiry(req.body);
  // WHY the same 201 + message even when a bot was ignored (enquiry = null):
  // the bot must not be able to tell that it was caught.
  new ApiResponse(201, enquiry, THANK_YOU).send(res);
});

// GET /api/enquiries   (admin)
const listEnquiries = asyncHandler(async (req, res) => {
  const result = await enquiryService.listEnquiries(req.validatedQuery);
  new ApiResponse(200, result, "Enquiries fetched").send(res);
});

// GET /api/enquiries/:id   (admin)
const getEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.getEnquiryById(req.params.id);
  new ApiResponse(200, enquiry, "Enquiry fetched").send(res);
});

// PATCH /api/enquiries/:id/status   (admin)
const updateEnquiryStatus = asyncHandler(async (req, res) => {
  const enquiry = await enquiryService.updateEnquiryStatus(req.params.id, req.body.status);
  new ApiResponse(200, enquiry, `Enquiry marked as ${enquiry.status}`).send(res);
});

module.exports = { createEnquiry, listEnquiries, getEnquiry, updateEnquiryStatus };
