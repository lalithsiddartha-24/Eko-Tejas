/**
 * services/booking.service.js
 *
 * WHY THIS FILE EXISTS:
 * Every business rule for test drives lives here:
 *   - you can only book a vehicle that exists
 *   - no duplicate active booking (same phone + vehicle + date)
 *   - status can only move forward: pending -> confirmed -> completed,
 *     and pending/confirmed -> cancelled. Finished bookings are final.
 * Controllers and routes never need to know these rules.
 */

const { supabase } = require("../config/supabase");
const ApiError = require("../utils/ApiError");
const vehicleService = require("./vehicle.service");

const TABLE = "test_drive_bookings";

// Postgres error codes we turn into friendly messages.
// WHY: the database is the final guard (unique index, foreign key). When it
// blocks something, we translate its code into a message a customer understands.
const PG_UNIQUE_VIOLATION = "23505";
const PG_FOREIGN_KEY_VIOLATION = "23503";

// What a customer gets back after booking: enough for a confirmation screen,
// without echoing their personal details back over the network.
const CUSTOMER_FIELDS =
  "id,preferred_date,preferred_time_slot,status,created_at,vehicle:vehicles(id,name,category)";

// What staff see in the admin panel: everything, plus the vehicle details.
// `vehicle:vehicles(...)` is a Supabase "embed": it follows the vehicle_id
// foreign key and nests the matching vehicle row inside each booking.
const ADMIN_FIELDS =
  "id,customer_name,phone,email,city,preferred_date,preferred_time_slot,message,status,created_at,updated_at,vehicle:vehicles(id,name,category)";

// Which status changes are allowed. Anything not listed here is rejected.
// WHY a map instead of if/else: the whole workflow is visible in 5 lines,
// and changing it later means editing data, not logic.
const ALLOWED_STATUS_CHANGES = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [], // final
  cancelled: [], // final
};

/**
 * Customer books a test drive. `input` is already validated by Zod.
 */
async function createBooking(input) {
  // Rule 1: the vehicle must exist.
  // WHY check here when the foreign key also checks: we want a clear,
  // field-level message ("Selected vehicle does not exist") instead of a raw
  // database error. The FK still protects us if a vehicle is deleted in between.
  try {
    await vehicleService.getVehicleById(input.vehicle_id);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 404) {
      throw ApiError.badRequest("Validation failed", [
        { field: "vehicle_id", message: "Selected vehicle does not exist" },
      ]);
    }
    throw error;
  }

  // Rule 2 (no duplicates) is enforced by the database's unique index.
  // We don't "check first, then insert": two clicks at the same moment would
  // both pass the check. Instead we insert and handle the conflict.
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      vehicle_id: input.vehicle_id,
      customer_name: input.customer_name,
      phone: input.phone,
      email: input.email ?? null,
      city: input.city,
      preferred_date: input.preferred_date,
      preferred_time_slot: input.preferred_time_slot,
      message: input.message ?? null,
      // status is NOT taken from input: every booking starts as 'pending'
      // (the column default). Customers can't approve themselves.
    })
    .select(CUSTOMER_FIELDS)
    .single();

  if (error) {
    if (error.code === PG_UNIQUE_VIOLATION) {
      throw ApiError.conflict(
        "You already have a test drive booked for this vehicle on that date"
      );
    }
    if (error.code === PG_FOREIGN_KEY_VIOLATION) {
      throw ApiError.badRequest("Validation failed", [
        { field: "vehicle_id", message: "Selected vehicle does not exist" },
      ]);
    }
    console.error("[booking.service] createBooking failed:", error);
    throw ApiError.internal("Could not create booking");
  }

  return data;
}

/**
 * Admin: list bookings, newest first, with optional status filter + paging.
 */
async function listBookings({ status, page, limit }) {
  // Supabase uses an inclusive range: page 1, limit 20 -> rows 0..19
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // count: "exact" asks Postgres for the total row count as well,
  // so the admin UI can show "Page 2 of 7".
  let query = supabase
    .from(TABLE)
    .select(ADMIN_FIELDS, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("[booking.service] listBookings failed:", error);
    throw ApiError.internal("Could not load bookings");
  }

  const total = count ?? 0;
  return {
    items: data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

/**
 * Admin: one booking by id.
 */
async function getBookingById(id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select(ADMIN_FIELDS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[booking.service] getBookingById failed:", error);
    throw ApiError.internal("Could not load booking");
  }
  if (!data) {
    throw ApiError.notFound("Booking not found");
  }
  return data;
}

/**
 * Admin: move a booking to a new status, following ALLOWED_STATUS_CHANGES.
 */
async function updateBookingStatus(id, newStatus) {
  const booking = await getBookingById(id); // throws 404 if missing
  const currentStatus = booking.status;

  if (currentStatus === newStatus) {
    return booking; // nothing to do. Calling it twice is harmless.
  }

  if (!ALLOWED_STATUS_CHANGES[currentStatus]?.includes(newStatus)) {
    throw ApiError.conflict(
      `Cannot change a ${currentStatus} booking to ${newStatus}`
    );
  }

  // WHY `.eq("status", currentStatus)`: if two staff members act at the same
  // time (one confirms, one cancels), only the first update matches. The
  // second finds no row with the old status and gets a clear 409 instead of
  // silently overwriting. This is called "optimistic concurrency".
  const { data, error } = await supabase
    .from(TABLE)
    .update({ status: newStatus })
    .eq("id", id)
    .eq("status", currentStatus)
    .select(ADMIN_FIELDS)
    .maybeSingle();

  if (error) {
    console.error("[booking.service] updateBookingStatus failed:", error);
    throw ApiError.internal("Could not update booking");
  }
  if (!data) {
    throw ApiError.conflict(
      "This booking was just changed by someone else. Refresh and try again."
    );
  }
  return data;
}

module.exports = {
  ALLOWED_STATUS_CHANGES,
  createBooking,
  listBookings,
  getBookingById,
  updateBookingStatus,
};
