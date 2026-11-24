/**
 * services/vehicle.service.js
 *
 * WHY THIS FILE EXISTS:
 * All business logic and database access for vehicles lives here, and ONLY
 * here. A service knows nothing about req/res. It takes plain values and
 * returns plain data, or throws an ApiError.
 *
 * WHY that matters: Module 3 (Test Drive Booking) needs to check that a
 * vehicle exists. It can just call vehicleService.getVehicleById(), without
 * going through HTTP or copying the query.
 */

const { supabase } = require("../config/supabase");
const ApiError = require("../utils/ApiError");

// WHY list columns instead of select("*"):
// 1. We only send what the website needs (smaller, faster responses).
// 2. If someone later adds an internal column (e.g. dealer_cost), it won't
//    leak to the public automatically.
const PUBLIC_VEHICLE_FIELDS = "id,name,category,tagline,range,power,image";

// The spec sheet columns from `vehicle_specifications` (migration 003),
// shown on the vehicle detail page.
// WHY a list again, not "*": that table also holds `specification_notes`,
// an INTERNAL note for staff ("verify before publishing"). Customers must
// never see it, so it is simply not in this list. Same for the columns that
// duplicate `vehicles` (name, category, range...) and its own id/created_at.
const SPECIFICATION_FIELDS = [
  "top_speed",
  "voltage",
  "rated_power",
  "motor_type",
  "motor_type_detail",
  "motor_power_options",
  "battery_options_and_range",
  "battery_type_detail",
  "battery_quantity",
  "charging_duration",
  "charger_specifications",
  "controller",
  "controller_detail",
  "transmission_mode",
  "brakes",
  "suspension",
  "wheels_and_tyre_size",
  "dimensions_mm",
  "dimensions_mm_detail",
  "ground_clearance_mm",
  "ground_clearance_detail",
  "boot_space_liters",
  "loading_capacity",
  "carrying_capacity_detail",
  "cargo_dimensions",
  "curb_weight",
  "gradeability",
  "lighting",
  "speedometer",
  "smart_features",
  "additional_fittings",
].join(",");

// The detail page's query: the vehicle PLUS its spec sheet, in ONE request.
// `specifications:vehicle_specifications(...)` is a Supabase "embed" (the same
// trick as `vehicle:vehicles(...)` in bookings): it follows the foreign key
// vehicle_specifications.vehicle_id -> vehicles.id and nests the matching row
// inside the vehicle, under the name `specifications`.
const VEHICLE_DETAIL_FIELDS = `${PUBLIC_VEHICLE_FIELDS},specifications:vehicle_specifications(${SPECIFICATION_FIELDS})`;

/**
 * Keep only the specs that have a value.
 * WHY: the scooters and the 3-wheelers fill DIFFERENT columns (a scooter has
 * `brakes`, a 3-wheeler has `cargo_dimensions`). Every other column is null.
 * Sending 20 empty fields would only make the response bigger.
 */
function cleanSpecifications(specifications) {
  // Supabase returns the embed as a one-item list ([{...}]) for our table,
  // or as an object ({...}) for a one-to-one constraint. Accept both.
  const row = Array.isArray(specifications) ? specifications[0] : specifications;
  return Object.fromEntries(
    Object.entries(row || {}).filter(([, value]) => value !== null && value !== undefined && String(value).trim() !== "")
  );
}

/**
 * List vehicles, optionally filtered by category.
 * @param {{ category?: "two-wheeler" | "three-wheeler" }} filters
 */
async function listVehicles({ category } = {}) {
  let query = supabase
    .from("vehicles")
    .select(PUBLIC_VEHICLE_FIELDS)
    .order("id", { ascending: true }); // stable order = same order as showroom catalogue

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  // WHY we don't return the Supabase error as-is: it can contain table names
  // and SQL hints. We log it on the server and throw a generic 500.
  if (error) {
    console.error("[vehicle.service] listVehicles failed:", error);
    throw ApiError.internal("Could not load vehicles");
  }

  return data;
}

/**
 * Find one vehicle by its exact name, e.g. "Axel Pro" or "ICE – 121",
 * together with its spec sheet (`specifications`, from migration 003).
 * Used by the vehicle detail (presentation) page.
 */
async function getVehicleByName(name) {
  // WHY .eq and not .ilike: ilike treats % and _ as wildcards, so a URL like
  // /api/vehicles/% would match a random vehicle. eq is an exact match.
  // maybeSingle() returns null (not an error) when no row matches.
  const { data, error } = await supabase
    .from("vehicles")
    .select(VEHICLE_DETAIL_FIELDS)
    .eq("name", name)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[vehicle.service] getVehicleByName failed:", error);
    throw ApiError.internal("Could not load vehicle");
  }
  if (!data) {
    throw ApiError.notFound(`Vehicle "${name}" not found`);
  }

  // A vehicle with no spec sheet yet gets specifications: {} (not an error):
  // the page still shows the basics (range, power) from `vehicles`.
  return { ...data, specifications: cleanSpecifications(data.specifications) };
}

/**
 * Find one vehicle by id.
 * WHY now: Module 3 uses it to confirm a booked vehicle really exists
 * before saving a test drive.
 */
async function getVehicleById(id) {
  const { data, error } = await supabase
    .from("vehicles")
    .select(PUBLIC_VEHICLE_FIELDS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[vehicle.service] getVehicleById failed:", error);
    throw ApiError.internal("Could not load vehicle");
  }
  if (!data) {
    throw ApiError.notFound("Vehicle not found");
  }

  return data;
}

module.exports = { listVehicles, getVehicleByName, getVehicleById };
