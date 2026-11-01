const { ApiError } = require("../middleware/errorMiddleware");

const VEHICLE_TABLE = "vehicles";
const VEHICLE_NAME_FIELDS = new Set([
  "name",
  "vehiclename",
  "model",
  "modelname",
  "title",
  "vehicle",
]);
const UNSAFE_KEYS = new Set(["__proto__", "prototype", "constructor"]);

function validateVehiclePayload(body, { update = false } = {}) {
  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body) ||
    Object.keys(body).length === 0
  ) {
    throw new ApiError(
      400,
      update ? "Vehicle update data is required" : "Vehicle data is required",
      "INVALID_VEHICLE"
    );
  }

  const keys = Object.keys(body);
  if (keys.some((key) => UNSAFE_KEYS.has(key.toLowerCase()))) {
    throw new ApiError(400, "Vehicle data contains an invalid field", "INVALID_VEHICLE");
  }
  if (update && keys.some((key) => key.toLowerCase() === "id")) {
    throw new ApiError(400, "The vehicle ID cannot be changed", "INVALID_VEHICLE");
  }
}

function normalizeName(value) {
  return value.toLocaleLowerCase();
}

function createVehicleController(databaseClient, presentationTable) {
  async function listVehicles(req, res) {
    const rawCategory = req.query.category;
    if (rawCategory !== undefined && typeof rawCategory !== "string") {
      throw new ApiError(400, "Category must be a single string", "INVALID_QUERY");
    }

    const category = (rawCategory || "").trim();
    if (category.length > 100) {
      throw new ApiError(400, "Category is too long", "INVALID_QUERY");
    }

    let query = databaseClient.from(VEHICLE_TABLE).select("*");
    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query.order("id", { ascending: true });
    if (error) {
      throw new ApiError(500, "Failed to fetch vehicles", "DATABASE_ERROR");
    }

    return res.json({ success: true, data });
  }

  async function getVehiclePresentation(req, res) {
    const requestedName = req.params.vehicleName.trim();
    if (!requestedName || requestedName.length > 200) {
      throw new ApiError(400, "Vehicle name is invalid", "INVALID_VEHICLE_NAME");
    }

    const { data, error } = await databaseClient
      .from(presentationTable)
      .select("*");
    if (error) {
      throw new ApiError(
        500,
        "Failed to fetch vehicle presentation",
        "DATABASE_ERROR"
      );
    }

    const vehicle = data?.find((row) => {
      const nameEntry = Object.entries(row).find(([key]) =>
        VEHICLE_NAME_FIELDS.has(key.toLocaleLowerCase().replace(/[^a-z0-9]/g, ""))
      );
      return (
        typeof nameEntry?.[1] === "string" &&
        normalizeName(nameEntry[1].trim()) === normalizeName(requestedName)
      );
    });

    if (!vehicle) {
      throw new ApiError(404, "Vehicle not found", "NOT_FOUND");
    }

    return res.json({ success: true, vehicle });
  }

  async function createVehicle(req, res) {
    validateVehiclePayload(req.body);

    const { data, error } = await databaseClient
      .from(VEHICLE_TABLE)
      .insert([req.body])
      .select();
    if (error) {
      throw new ApiError(500, "Failed to create vehicle", "DATABASE_ERROR");
    }

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      vehicle: data?.[0] || req.body,
    });
  }

  async function updateVehicle(req, res) {
    const { id } = req.params;
    validateVehiclePayload(req.body, { update: true });

    let query = databaseClient.from(VEHICLE_TABLE).update(req.body).select();
    const { data, error } = /^\d+$/.test(id)
      ? await query.eq("id", Number(id))
      : await query.eq("name", id);

    if (error) {
      throw new ApiError(500, "Failed to update vehicle", "DATABASE_ERROR");
    }
    if (!data?.length) {
      throw new ApiError(404, "Vehicle not found", "NOT_FOUND");
    }

    return res.json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle: data[0],
    });
  }

  async function deleteVehicle(req, res) {
    const { id } = req.params;
    let query = databaseClient.from(VEHICLE_TABLE).delete().select();
    const { data, error } = /^\d+$/.test(id)
      ? await query.eq("id", Number(id))
      : await query.eq("name", id);

    if (error) {
      throw new ApiError(500, "Failed to delete vehicle", "DATABASE_ERROR");
    }
    if (!data?.length) {
      throw new ApiError(404, "Vehicle not found", "NOT_FOUND");
    }

    return res.json({
      success: true,
      message: "Vehicle deleted successfully",
      vehicle: data[0],
    });
  }

  return {
    listVehicles,
    getVehiclePresentation,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  };
}

module.exports = { createVehicleController };
