/**
 * services/enquiry.service.js
 *
 * WHY THIS FILE EXISTS:
 * Business rules for customer enquiries:
 *   - bots that fill the honeypot are silently ignored
 *   - if a vehicle is mentioned, it must exist
 *   - the same question sent twice within 10 minutes is saved only once
 *   - status workflow: new -> contacted -> closed (or new -> closed)
 */

const { supabase } = require("../config/supabase");
const ApiError = require("../utils/ApiError");
const vehicleService = require("./vehicle.service");

const TABLE = "enquiries";
const DUPLICATE_WINDOW_MINUTES = 10;
const PG_FOREIGN_KEY_VIOLATION = "23503";

// What the customer gets back: a reference number for "Your enquiry #12".
const CUSTOMER_FIELDS = "id,enquiry_type,status,created_at";

// What staff see, including the vehicle the question is about (if any).
const ADMIN_FIELDS =
  "id,customer_name,phone,email,city,enquiry_type,message,status,created_at,updated_at,vehicle:vehicles(id,name,category)";

const ALLOWED_STATUS_CHANGES = {
  new: ["contacted", "closed"],
  contacted: ["closed"],
  closed: [], // final
};

const vehicleMissingError = () =>
  ApiError.badRequest("Validation failed", [
    { field: "vehicle_id", message: "Selected vehicle does not exist" },
  ]);

/**
 * Customer sends an enquiry. `input` is already validated by Zod.
 * Returns the saved enquiry, or null when a bot was quietly ignored.
 */
async function createEnquiry(input) {
  // Rule 1: honeypot filled = bot. Pretend success, save nothing.
  // WHY not return 400: an error teaches the bot which field to leave empty.
  if (input.website) {
    console.warn("[enquiry.service] Honeypot triggered, enquiry ignored");
    return null;
  }

  // Rule 2: a mentioned vehicle must exist.
  if (input.vehicle_id) {
    try {
      await vehicleService.getVehicleById(input.vehicle_id);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 404) throw vehicleMissingError();
      throw error;
    }
  }

  // Rule 3: same phone + same message in the last 10 minutes = a double
  // submit (impatient click, page refresh). Return the existing enquiry
  // instead of creating a copy.
  // WHY a code check here but a unique INDEX for bookings: a duplicate
  // enquiry is only a nuisance (one extra call), not a double-booked slot.
  // A time window can't be expressed as a simple unique index, so a
  // best-effort check is the right trade-off.
  const since = new Date(Date.now() - DUPLICATE_WINDOW_MINUTES * 60 * 1000).toISOString();
  const { data: existing, error: lookupError } = await supabase
    .from(TABLE)
    .select(CUSTOMER_FIELDS)
    .eq("phone", input.phone)
    .eq("message", input.message)
    .gte("created_at", since)
    .limit(1)
    .maybeSingle();

  if (lookupError) {
    console.error("[enquiry.service] duplicate check failed:", lookupError);
    throw ApiError.internal("Could not send enquiry");
  }
  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      customer_name: input.customer_name,
      phone: input.phone,
      email: input.email ?? null,
      city: input.city ?? null,
      enquiry_type: input.enquiry_type,
      vehicle_id: input.vehicle_id ?? null,
      message: input.message,
      // status not taken from input: every enquiry starts as 'new'.
    })
    .select(CUSTOMER_FIELDS)
    .single();

  if (error) {
    if (error.code === PG_FOREIGN_KEY_VIOLATION) throw vehicleMissingError();
    console.error("[enquiry.service] createEnquiry failed:", error);
    throw ApiError.internal("Could not send enquiry");
  }

  return data;
}

/**
 * Admin: list enquiries, newest first, filter by status and/or type.
 */
async function listEnquiries({ status, type, page, limit }) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from(TABLE)
    .select(ADMIN_FIELDS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status) query = query.eq("status", status);
  if (type) query = query.eq("enquiry_type", type);

  const { data, error, count } = await query;

  if (error) {
    console.error("[enquiry.service] listEnquiries failed:", error);
    throw ApiError.internal("Could not load enquiries");
  }

  const total = count ?? 0;
  return {
    items: data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

/**
 * Admin: one enquiry by id.
 */
async function getEnquiryById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(ADMIN_FIELDS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[enquiry.service] getEnquiryById failed:", error);
    throw ApiError.internal("Could not load enquiry");
  }
  if (!data) {
    throw ApiError.notFound("Enquiry not found");
  }
  return data;
}

/**
 * Admin: move an enquiry along the workflow.
 * Same safety pattern as bookings: allowed-transition map + only update if
 * the status hasn't changed since we read it (optimistic concurrency).
 */
async function updateEnquiryStatus(id, newStatus) {
  const enquiry = await getEnquiryById(id);
  const currentStatus = enquiry.status;

  if (currentStatus === newStatus) return enquiry;

  if (!ALLOWED_STATUS_CHANGES[currentStatus]?.includes(newStatus)) {
    throw ApiError.conflict(`Cannot change a ${currentStatus} enquiry to ${newStatus}`);
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update({ status: newStatus })
    .eq("id", id)
    .eq("status", currentStatus)
    .select(ADMIN_FIELDS)
    .maybeSingle();

  if (error) {
    console.error("[enquiry.service] updateEnquiryStatus failed:", error);
    throw ApiError.internal("Could not update enquiry");
  }
  if (!data) {
    throw ApiError.conflict("This enquiry was just changed by someone else. Refresh and try again.");
  }
  return data;
}

module.exports = {
  ALLOWED_STATUS_CHANGES,
  createEnquiry,
  listEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
};
