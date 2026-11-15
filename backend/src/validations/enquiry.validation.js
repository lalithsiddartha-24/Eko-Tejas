/**
 * validations/enquiry.validation.js
 *
 * WHY THIS FILE EXISTS:
 * Rules for the public "Contact us / Ask a question" form and for the admin
 * enquiry endpoints. Field rules shared with bookings come from
 * common.validation.js, so both forms accept phone numbers the same way.
 */

const { z } = require("zod");
const common = require("./common.validation");

const ENQUIRY_TYPES = ["general", "pricing", "finance", "dealership", "service"];
const ENQUIRY_STATUSES = ["new", "contacted", "closed"];

// POST /api/enquiries
const createEnquiryBody = z
  .object({
    customer_name: common.customerName,
    phone: common.indianPhone,
    email: common.optionalEmail,
    city: common.optionalCity,

    enquiry_type: z
      .enum(ENQUIRY_TYPES, {
        errorMap: () => ({ message: `Enquiry type must be one of: ${ENQUIRY_TYPES.join(", ")}` }),
      })
      .default("general"),

    // Optional: the question may be about one vehicle, or none.
    vehicle_id: z.preprocess(common.emptyToUndefined, common.vehicleId.optional()),

    message: z
      .string({ required_error: "Please write your question" })
      .trim()
      .min(10, "Please write at least 10 characters")
      .max(1000, "Message must be at most 1000 characters"),

    // HONEYPOT: a hidden field humans never see, so they leave it empty.
    // Spam bots fill in every field they find. We accept it here (so the
    // bot gets no error to learn from) and the service quietly drops it.
    website: z.string().max(200).optional(),
  })
  // A customer can't send { status: "closed" } or any other unknown field.
  .strict();

// GET /api/enquiries?status=new&type=pricing&page=1&limit=20   (admin)
const listEnquiriesQuery = z.object({
  status: z.enum(ENQUIRY_STATUSES).optional(),
  type: z.enum(ENQUIRY_TYPES).optional(),
  ...common.pagination,
});

const enquiryIdParams = common.idParams;

// PATCH /api/enquiries/:id/status   (admin)
const updateEnquiryStatusBody = z
  .object({ status: z.enum(ENQUIRY_STATUSES) })
  .strict();

module.exports = {
  ENQUIRY_TYPES,
  ENQUIRY_STATUSES,
  createEnquiryBody,
  listEnquiriesQuery,
  enquiryIdParams,
  updateEnquiryStatusBody,
};
