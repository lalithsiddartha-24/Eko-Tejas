/**
 * Reads a fetch() Response as our API's `{ success, message, data }` JSON.
 * Throws a friendly Error when the response is not OK or not JSON.
 *
 * The thrown error also carries:
 *   - `error.status`: the HTTP status code (e.g. 400, 409)
 *   - `error.errors`: the backend's per-field list, e.g.
 *       [{ field: "phone", message: "Enter a valid 10-digit Indian mobile number" }]
 * Forms use `errors` to show each message under the matching input.
 * (Adding properties keeps the old behaviour: `error.message` is unchanged.)
 */
export async function readApiJson(response) {
  const body = await response.text();
  let payload;

  try {
    payload = JSON.parse(body);
  } catch {
    if (!response.ok) {
      throw apiError(
        `Request failed with HTTP ${response.status}; the server returned a non-JSON response.`,
        response.status,
      );
    }
    throw apiError(`The server returned invalid JSON (HTTP ${response.status}).`, response.status);
  }

  if (!response.ok) {
    throw apiError(
      typeof payload?.message === "string"
        ? payload.message
        : `Request failed with HTTP ${response.status}.`,
      response.status,
      Array.isArray(payload?.errors) ? payload.errors : [],
    );
  }

  return payload;
}

function apiError(message, status, errors = []) {
  const error = new Error(message);
  error.status = status;
  error.errors = errors;
  return error;
}

/**
 * Sends `body` as JSON with POST and returns the parsed API payload.
 * Used by the enquiry and test drive forms.
 */
export async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return readApiJson(response);
}

/** Turns the backend's `[{ field, message }]` list into `{ field: message }`. */
export function fieldErrorsFrom(error) {
  const result = {};
  for (const item of error?.errors || []) {
    if (item?.field && !result[item.field]) result[item.field] = item.message;
  }
  return result;
}
