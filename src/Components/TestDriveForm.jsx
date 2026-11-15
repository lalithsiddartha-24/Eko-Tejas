import { CalendarCheck, LoaderCircle, Moon, Sun, Sunrise } from "lucide-react";
import { useState } from "react";
import { fieldErrorsFrom, postJson } from "../utils/api";
import { addDays, todayInIndia, validateContactFields } from "../utils/formRules";
import Button from "./ui/Button";
import FormField from "./ui/FormField";

const timeSlots = [
  { value: "morning", label: "Morning", icon: Sunrise },
  { value: "afternoon", label: "Afternoon", icon: Sun },
  { value: "evening", label: "Evening", icon: Moon },
];

const MAX_DAYS_AHEAD = 60; // same limit as the backend

const emptyForm = {
  customer_name: "",
  phone: "",
  email: "",
  city: "",
  preferred_date: "",
  preferred_time_slot: "",
  message: "",
};

const prettyDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

/**
 * "Book a test drive" form -> POST /api/bookings
 *
 * The backend rejects any field it doesn't know (Zod `.strict()`), so we
 * send exactly the fields it expects, nothing more.
 */
function TestDriveForm({ vehicleId, vehicleName }) {
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const [booking, setBooking] = useState(null);

  // The date picker only offers dates the backend will accept.
  const minDate = todayInIndia();
  const maxDate = addDays(minDate, MAX_DAYS_AHEAD);

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    const problems = validateContactFields(values, { cityRequired: true });
    if (!values.preferred_date) problems.preferred_date = "Please pick a date.";
    else if (values.preferred_date < minDate || values.preferred_date > maxDate)
      problems.preferred_date = `Pick a date between today and the next ${MAX_DAYS_AHEAD} days.`;
    if (!values.preferred_time_slot) problems.preferred_time_slot = "Please choose a time of day.";
    if (Object.keys(problems).length) {
      setErrors(problems);
      return;
    }

    setSending(true);
    try {
      const payload = await postJson("/api/bookings", { vehicle_id: vehicleId, ...values });
      setBooking(payload.data || { preferred_date: values.preferred_date, preferred_time_slot: values.preferred_time_slot });
    } catch (error) {
      setErrors(fieldErrorsFrom(error));
      // 409 = "conflict": the backend found the same booking already exists.
      setFormError(error.message || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (booking) {
    return (
      <div role="status" className="flex flex-col items-center py-10 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-volt/30 text-forest-700">
          <CalendarCheck size={30} />
        </span>
        <h3 className="mt-6 font-display text-2xl font-bold text-forest-900">Test drive requested!</h3>
        <p className="mt-2 max-w-sm text-muted">
          {vehicleName} on <strong className="text-forest-900">{prettyDate(booking.preferred_date)}</strong>,{" "}
          {booking.preferred_time_slot}. We&apos;ll call you to confirm.
        </p>
        {booking.id && <p className="mt-4 rounded-full bg-mint-100 px-4 py-1.5 text-xs font-semibold text-forest-700">Reference #{booking.id}</p>}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <FormField label="Your name" name="customer_name" autoComplete="name" value={values.customer_name} onChange={update} error={errors.customer_name} required />
      <FormField label="Mobile number" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" value={values.phone} onChange={update} error={errors.phone} required />
      <FormField label="City" name="city" autoComplete="address-level2" value={values.city} onChange={update} error={errors.city} required />
      <FormField label="Email" optional name="email" type="email" autoComplete="email" value={values.email} onChange={update} error={errors.email} />
      <FormField
        label="Preferred date"
        name="preferred_date"
        type="date"
        min={minDate}
        max={maxDate}
        value={values.preferred_date}
        onChange={update}
        error={errors.preferred_date}
        className="sm:col-span-2"
        required
      />

      {/*
        Time slot as big tappable "radio cards" instead of a dropdown.
        They are still real radio inputs (visually hidden with `sr-only`),
        so keyboard arrows and screen readers work as normal.
      */}
      <fieldset className="sm:col-span-2" aria-describedby={errors.preferred_time_slot ? "slot-error" : undefined}>
        <legend className="mb-1.5 text-sm font-semibold text-forest-900">Time of day</legend>
        <div className="grid grid-cols-3 gap-2">
          {timeSlots.map(({ value, label, icon: Icon }) => {
            const checked = values.preferred_time_slot === value;
            return (
              <label
                key={value}
                className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-sm font-semibold transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-forest-600/20 ${
                  checked
                    ? "border-forest-900 bg-forest-900 text-white"
                    : "border-forest-900/12 bg-white text-forest-900 hover:border-forest-900/30"
                }`}
              >
                <input type="radio" name="preferred_time_slot" value={value} checked={checked} onChange={update} className="sr-only" />
                <Icon size={18} className={checked ? "text-volt" : "text-forest-600"} aria-hidden="true" />
                {label}
              </label>
            );
          })}
        </div>
        {errors.preferred_time_slot && (
          <p id="slot-error" className="mt-1.5 text-xs text-red-600">{errors.preferred_time_slot}</p>
        )}
      </fieldset>

      <FormField as="textarea" label="Anything we should know?" optional name="message" rows={3} maxLength={500} value={values.message} onChange={update} error={errors.message} className="sm:col-span-2" />

      {formError && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
          {formError}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={sending} className="sm:col-span-2">
        {sending ? (
          <>
            <LoaderCircle size={18} className="animate-spin" /> Booking…
          </>
        ) : (
          <>
            <CalendarCheck size={18} /> Request test drive
          </>
        )}
      </Button>
    </form>
  );
}

export default TestDriveForm;
