/**
 * utils/ApiResponse.js
 *
 * WHY THIS FILE EXISTS:
 * Every successful response from our API has the SAME shape:
 *
 *   { success: true, message: "...", data: ... }
 *
 * The frontend (src/utils/api.js -> readApiJson) already expects `success`,
 * `data` and `message`. If each controller built its own object, one day
 * someone would write `{ ok: true, result: [...] }` and a page would break.
 * One class = one shape everywhere.
 */

class ApiResponse {
  /**
   * @param {number} statusCode HTTP status, e.g. 200 OK, 201 Created
   * @param {*}      data       The payload (a vehicle, a list, a booking...)
   * @param {string} message    Short human-readable note
   */
  constructor(statusCode, data = null, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
  }

  // Sends this response through Express.
  // WHY a method: controllers become a single readable line:
  //   new ApiResponse(201, booking, "Test drive booked").send(res);
  send(res) {
    return res.status(this.statusCode).json({
      success: this.statusCode < 400,
      message: this.message,
      data: this.data,
    });
  }
}

module.exports = ApiResponse;
