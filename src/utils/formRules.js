/**
 * Small checks the forms run BEFORE sending, so people see mistakes instantly.
 *
 * WHY check twice (here and on the server)? The browser check is for comfort:
 * it is fast and friendly. The server check (Zod in the backend) is for
 * safety, because anyone can skip the website and call the API directly.
 * These rules copy the backend's rules so both agree.
 */

// Same cleanup as the backend: "+91 98765-43210" -> "9876543210".
export function normalizePhone(value) {
  return value.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, "");
}

export function isValidIndianPhone(value) {
  return /^[6-9]\d{9}$/.test(normalizePhone(value));
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// "Today" in India as YYYY-MM-DD (the backend also uses Asia/Kolkata).
export function todayInIndia() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function addDays(isoDate, days) {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Checks shared by both forms. Returns `{ field: message }` for problems. */
export function validateContactFields(values, { cityRequired = false } = {}) {
  const errors = {};
  const name = values.customer_name.trim();
  if (name.length < 2) errors.customer_name = "Please enter your name (at least 2 characters).";
  if (!isValidIndianPhone(values.phone)) errors.phone = "Enter a valid 10-digit Indian mobile number.";
  if (values.email.trim() && !isValidEmail(values.email)) errors.email = "Enter a valid email address.";
  const city = values.city.trim();
  if ((cityRequired || city) && city.length < 2) errors.city = "Please enter your city.";
  return errors;
}
