require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 5000;
const vehiclePresentationTable =
  process.env.SUPABASE_VEHICLE_PRESENTATION_TABLE || "All vehicles";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  );
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

function handleSupabaseError(res, error, message = "Database operation failed") {
  if (error) {
    return res.status(500).json({
      success: false,
      message,
      error: error.message,
    });
  }

  return null;
}

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
    service: "ekotejas-backend",
  });
});

app.get("/api/vehicles", async (req, res) => {
  try {
    const category = String(req.query.category || "").trim();
    let query = supabase.from("vehicles").select("*");

    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query.order("id", { ascending: true });

    if (handleSupabaseError(res, error, "Failed to fetch vehicles")) {
      return;
    }

    return res.json({
      success: true,
      data,
    });
  }
  catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching vehicles",
      error: error.message,
    });
  }
});

app.get("/api/vehicle-presentations/:vehicleName", async (req, res) => {
  try {
    const requestedName = req.params.vehicleName.trim().toLocaleLowerCase();
    const { data, error } = await supabase
      .from(vehiclePresentationTable)
      .select("*");

    if (handleSupabaseError(res, error, "Failed to fetch vehicle presentation")) {
      return;
    }

    const nameFields = new Set([
      "name",
      "vehiclename",
      "model",
      "modelname",
      "title",
      "vehicle",
    ]);
    const vehicle = data?.find((row) => {
      const nameEntry = Object.entries(row).find(([key]) =>
        nameFields.has(key.toLocaleLowerCase().replace(/[^a-z0-9]/g, ""))
      );
      return (
        typeof nameEntry?.[1] === "string" &&
        nameEntry[1].trim().toLocaleLowerCase() === requestedName
      );
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.json({
      success: true,
      vehicle,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching vehicle presentation",
      error: error.message,
    });
  }
});

app.post("/api/vehicles", async (req, res) => {
  try {
    const vehicle = req.body;

    if (!vehicle || Object.keys(vehicle).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vehicle data is required",
      });
    }

    const { data, error } = await supabase
      .from("vehicles")
      .insert([vehicle])
      .select();

    if (handleSupabaseError(res, error, "Failed to create vehicle")) {
      return;
    }

    return res.status(201).json({
      success: true,
      message: "Vehicle created successfully",
      vehicle: data?.[0] || vehicle,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while creating vehicle",
      error: error.message,
    });
  }
});

app.put("/api/vehicles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedVehicle = req.body;

    if (!updatedVehicle || Object.keys(updatedVehicle).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Vehicle update data is required",
      });
    }

    let query = supabase.from("vehicles").update(updatedVehicle).select();

    const { data, error } = Number.isNaN(Number(id))
      ? await query.eq("name", id)
      : await query.eq("id", Number(id));

    if (handleSupabaseError(res, error, "Failed to update vehicle")) {
      return;
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle: data[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating vehicle",
      error: error.message,
    });
  }
});

app.delete("/api/vehicles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let query = supabase.from("vehicles").delete().select();

    const { data, error } = Number.isNaN(Number(id))
      ? await query.eq("name", id)
      : await query.eq("id", Number(id));

    if (handleSupabaseError(res, error, "Failed to delete vehicle")) {
      return;
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.json({
      success: true,
      message: "Vehicle deleted successfully",
      vehicle: data[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting vehicle",
      error: error.message,
    });
  }
});

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});