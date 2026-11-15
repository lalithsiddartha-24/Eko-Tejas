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
 * Find one vehicle by its exact name, e.g. "Axel Pro" or "ICE – 121".
 * Used by the vehicle detail (presentation) page.
 */
async function getVehicleByName(name) {
  // WHY .eq and not .ilike: ilike treats % and _ as wildcards, so a URL like
  // /api/vehicles/% would match a random vehicle. eq is an exact match.
  // maybeSingle() returns null (not an error) when no row matches.
  const { data, error } = await supabase
    .from("vehicles")
    .select(PUBLIC_VEHICLE_FIELDS)
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

  return data;
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
