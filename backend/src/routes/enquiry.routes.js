/**
 * routes/enquiry.routes.js
 *
 * WHY THIS FILE EXISTS:
 * Who may call what, and which checks run first. ONLY routing here.
 * Mounted at /api/enquiries in routes/index.js.
 */

const { Router } = require("express");
const validate = require("../middlewares/validation.middleware");
const { authenticate, requireRole } = require("../middlewares/auth.middleware");
const {
  createEnquiryBody,
  listEnquiriesQuery,
  enquiryIdParams,
  updateEnquiryStatusBody,
} = require("../validations/enquiry.validation");
const enquiryController = require("../controllers/enquiry.controller");

const router = Router();

// PUBLIC: anyone can ask a question.
router.post("/", validate({ body: createEnquiryBody }), enquiryController.createEnquiry);

// ADMIN ONLY: enquiries contain customer phone numbers.
const adminOnly = [authenticate, requireRole("admin")];

router.get("/", ...adminOnly, validate({ query: listEnquiriesQuery }), enquiryController.listEnquiries);
router.get("/:id", ...adminOnly, validate({ params: enquiryIdParams }), enquiryController.getEnquiry);
router.patch(
  "/:id/status",
  ...adminOnly,
  validate({ params: enquiryIdParams, body: updateEnquiryStatusBody }),
  enquiryController.updateEnquiryStatus
);

module.exports = router;
