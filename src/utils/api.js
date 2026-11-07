export async function readApiJson(response) {
  const body = await response.text();
  let payload;

  try {
    payload = JSON.parse(body);
  } catch {
    if (!response.ok) {
      throw new Error(
        `Request failed with HTTP ${response.status}; the server returned a non-JSON response.`,
      );
    }
    throw new Error(`The server returned invalid JSON (HTTP ${response.status}).`);
  }

  if (!response.ok) {
    throw new Error(
      typeof payload?.message === "string"
        ? payload.message
        : `Request failed with HTTP ${response.status}.`,
    );
  }

  return payload;
}
