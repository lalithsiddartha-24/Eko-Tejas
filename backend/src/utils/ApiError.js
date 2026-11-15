/**
 * utils/ApiError.js
 *
 * WHY THIS FILE EXISTS:
 * A normal JavaScript Error only carries a message. An API error also needs an
 * HTTP status code (400, 404, 500...) so the client knows WHAT went wrong.
 * Anywhere in a service we can now write:
 *
 *   throw new ApiError(404, "Vehicle not found");
 *
 * and the error middleware turns it into a proper JSON response. No service or
 * controller has to build error responses by hand.
 */

class ApiError extends Error {
  /**
   * @param {number} statusCode HTTP status, e.g. 400, 404, 409, 500
   * @param {string} message    Safe, human-readable message for the client
   * @param {Array}  errors     Optional details, e.g. which form fields failed
   */
  constructor(statusCode, message = "Something went wrong", errors = []) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
    // WHY: marks this as an error WE created on purpose (expected), versus a
    // bug or crash. The error middleware only shows the message to the client
    // for expected errors and hides internal details for everything else.
    this.isOperational = true;
  }

  // Small shortcuts so services read like plain English.
  static badRequest(message, errors) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = "Please log in to continue") {
    return new ApiError(401, message);
  }

  static forbidden(message = "You are not allowed to do this") {
    return new ApiError(403, message);
  }

  static notFound(message = "Resource not found") {
    return new ApiError(404, message);
  }

  static conflict(message) {
    return new ApiError(409, message);
  }

  static internal(message = "Internal server error") {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;
