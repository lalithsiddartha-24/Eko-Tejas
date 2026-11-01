class ApiError extends Error {
  constructor(status, message, code) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

function notFoundHandler(req, res, next) {
  next(new ApiError(404, "Route not found", "NOT_FOUND"));
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  let status = Number.isInteger(error.status) ? error.status : 500;
  let message = error.message;
  let code = error.code || "INTERNAL_SERVER_ERROR";

  if (error.type === "entity.too.large") {
    status = 413;
    message = "Request body is too large";
    code = "PAYLOAD_TOO_LARGE";
  } else if (error.type === "entity.parse.failed") {
    status = 400;
    message = "Request body must contain valid JSON";
    code = "INVALID_JSON";
  } else if (status >= 500 && !error.expose) {
    message = "Internal server error";
  }

  if (status >= 500) {
    console.error(
      JSON.stringify({
        event: "api_error",
        status,
        error: error.name || "Error",
        code,
      })
    );
  }

  return res.status(status).json({
    success: false,
    message,
    error: code,
  });
}

module.exports = { ApiError, errorHandler, notFoundHandler };
