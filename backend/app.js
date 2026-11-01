const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { errorHandler, notFoundHandler } = require("./middleware/errorMiddleware");
const { createVehicleRoutes } = require("./routes/vehicleRoutes");
const healthRoutes = require("./routes/healthRoutes");

function getAllowedOrigins() {
  const origins = (process.env.CORS_ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.map((origin) => {
    let parsedOrigin;
    try {
      parsedOrigin = new URL(origin);
    } catch {
      throw new Error("CORS_ALLOWED_ORIGINS must contain valid origins");
    }

    if (
      !["http:", "https:"].includes(parsedOrigin.protocol) ||
      parsedOrigin.origin !== origin
    ) {
      throw new Error("CORS_ALLOWED_ORIGINS must contain valid HTTP(S) origins");
    }
    return parsedOrigin.origin;
  });
}

function requestLogger(req, res, next) {
  const startedAt = process.hrtime.bigint();
  res.on("finish", () => {
    const route = req.route ? `${req.baseUrl}${req.route.path}` : "unmatched";
    console.info(
      JSON.stringify({
        event: "http_request",
        method: req.method,
        route,
        status: res.statusCode,
        duration_ms: Number(process.hrtime.bigint() - startedAt) / 1e6,
      })
    );
  });
  next();
}

function createApp(clients) {
  if (!clients?.authClient || !clients?.databaseClient) {
    throw new Error("Supabase auth and database clients are required");
  }

  const app = express();
  const presentationTable =
    process.env.SUPABASE_VEHICLE_PRESENTATION_TABLE || "All vehicles";
  const allowedOrigins = getAllowedOrigins();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: false,
    })
  );
  app.use(express.json({ limit: "100kb" }));
  app.use(requestLogger);

  app.use("/api/health", healthRoutes);
  app.use(
    "/api",
    createVehicleRoutes({
      authClient: clients.authClient,
      databaseClient: clients.databaseClient,
      presentationTable,
    })
  );

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
