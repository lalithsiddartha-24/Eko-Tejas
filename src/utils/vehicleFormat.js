/**
 * Helpers for showing vehicle data nicely. Shared by the vehicle cards and
 * the vehicle detail page, so "120" becomes "120 km" in both places.
 */

// "Max Speed", "max_speed" and "maxSpeed" all become "maxspeed",
// so we can match field names no matter how they are written.
export function normalizedKey(key) {
  return String(key).toLocaleLowerCase().replace(/[^a-z0-9]/g, "");
}

const fieldUnits = [
  { fields: ["range", "driving range", "range per charge"], unit: "km" },
  { fields: ["power", "rated power", "motor power"], unit: "kW" },
  { fields: ["battery capacity"], unit: "kWh" },
  { fields: ["maximum speed", "max speed", "top speed"], unit: "km/h" },
  { fields: ["payload capacity", "payload"], unit: "kg" },
];

export function formatFieldValue(value) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object" && value !== null) return JSON.stringify(value);
  return String(value);
}

/** Adds a unit when the value is a bare number: ("range", 120) -> "120 km". */
export function formatSpecificationValue(key, value) {
  const formattedValue = formatFieldValue(value).trim();
  const unit = fieldUnits.find(({ fields }) =>
    fields.some((field) => normalizedKey(field) === normalizedKey(key)),
  )?.unit;
  if (!unit || !/^-?\d+(?:[.,]\d+)?$/.test(formattedValue)) {
    return formattedValue;
  }
  return `${formattedValue} ${unit}`;
}

/** True for "three-wheeler", "3 Wheeler", "3W"... */
export function isThreeWheelerCategory(category) {
  return /three|3\s*-?\s*w/i.test(String(category || ""));
}
