const express = require("express");
const { createSupabaseClient } = require("./config/supabase");

const VEHICLE_FIELDS = "name,category,tagline,range,power,image";
const VEHICLE_CATEGORIES = new Set(["two-wheeler", "three-wheeler"]);

function createApp({ getSupabaseClient = createSupabaseClient } = {}) {
  const app = express();

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/api/vehicles", async (req, res) => {
    const category = req.query.category;
    if (
      category !== undefined &&
      (typeof category !== "string" || !VEHICLE_CATEGORIES.has(category))
    ) {
      return res.status(400).json({
        success: false,
        message: "Category must be two-wheeler or three-wheeler",
      });
    }

    try {
      let query = getSupabaseClient()
        .from("vehicles")
        .select(VEHICLE_FIELDS)
        .order("id", { ascending: true });

      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Supabase error while listing vehicles:", error);
        return res.status(500).json({
          success: false,
          message: "Failed to fetch vehicles",
        });
      }

      return res.json({ success: true, data });
    } catch (error) {
      console.error("Failed to list vehicles:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to fetch vehicles",
      });
    }
  });

  return app;
}

const app = createApp();
module.exports = app;
module.exports.createApp = createApp;
