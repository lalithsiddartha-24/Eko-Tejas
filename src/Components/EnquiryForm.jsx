import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { fieldErrorsFrom, postJson } from "../utils/api";
import { validateContactFields } from "../utils/formRules";
import Button from "./ui/Button";
import FormField from "./ui/FormField";

const enquiryTypes = [
  { value: "general", label: "General question" },
  { value: "pricing", label: "Pricing" },
  { value: "finance", label: "Finance / EMI" },
  { value: "dealership", label: "Become a dealer" },
  { value: "service", label: "Service & care" },
];

const emptyForm = {
  customer_name: "",
  phone: "",
  email: "",
  city: "",
  enquiry_type: "general",
  message: "",
  website: "", // honeypot, see below
};

/**
 * Contact form -> POST /api/enquiries
 *
 * HOW a "controlled form" works: every input's value lives in React state
 * (`values`). Typing calls `update`, which stores the new value, and React
 * re-renders the input with it. That way we always know what's in the form.
 */
function EnquiryForm({ defaultType = "general" }) {
  const [values, setValues] = useState({ ...emptyForm, enquiry_type: defaultType });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent
  const [formError, setFormError] = useState("");

  const update = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    // Clear a field's error as soon as the person starts fixing it.
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // stop the browser from reloading the page
    setFormError("");

    const problems = validateContactFields(values);
    if (values.message.trim().length < 10) problems.message = "Please write at least 10 characters.";
    if (Object.keys(problems).length) {
      setErrors(problems);
      return;
    }

    setStatus("sending");
    try {
      await postJson("/api/enquiries", values);
      setStatus("sent");
    } catch (error) {
      // The server may reject a field our quick check missed; show it inline.
      setErrors(fieldErrorsFrom(error));
      setFormError(error.message || "Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="flex min-h-[28rem] flex-col items-center justify-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-volt/30 text-forest-700">
          <CheckCircle2 size={30} />
        </span>
        <h3 className="mt-6 font-display text-2xl font-bold text-forest-900">Thanks, we&apos;ve got your message.</h3>
        <p className="mt-2 max-w-sm text-muted">Our team will get back to you soon.</p>
        <Button
          variant="outline"
          className="mt-8"
          onClick={() => {
            setValues({ ...emptyForm, enquiry_type: defaultType });
            setStatus("idle");
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    // noValidate: we show our own friendly messages instead of the browser's popups.
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <FormField label="Your name" name="customer_name" autoComplete="name" value={values.customer_name} onChange={update} error={errors.customer_name} required />
      <FormField label="Mobile number" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="98765 43210" value={values.phone} onChange={update} error={errors.phone} required />
      <FormField label="Email" optional name="email" type="email" autoComplete="email" value={values.email} onChange={update} error={errors.email} />
      <FormField label="City" optional name="city" autoComplete="address-level2" value={values.city} onChange={update} error={errors.city} />
      <FormField as="select" label="What is it about?" name="enquiry_type" value={values.enquiry_type} onChange={update} error={errors.enquiry_type} className="sm:col-span-2">
        {enquiryTypes.map((type) => (
          <option key={type.value} value={type.value}>{type.label}</option>
        ))}
      </FormField>
      <FormField as="textarea" label="Message" name="message" rows={4} maxLength={1000} placeholder="Tell us what you're looking for…" value={values.message} onChange={update} error={errors.message} className="sm:col-span-2" required />

      {/*
        HONEYPOT (spam trap): a field real people never see or fill in.
        Spam bots fill in every input they find, so if "website" has a value
        the backend quietly ignores the message. It's moved off-screen
        (not display:none, which some bots detect), skipped by Tab
        (tabIndex -1) and hidden from screen readers (aria-hidden).
      */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={update} />
        </label>
      </div>

      {formError && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 sm:col-span-2">
          {formError}
        </p>
      )}

      <div className="flex flex-col-reverse gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">We only use your details to reply to you.</p>
        <Button type="submit" variant="dark" size="lg" disabled={sending}>
          {sending ? (
            <>
              <LoaderCircle size={18} className="animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send message <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default EnquiryForm;
