import { useId } from "react";

/**
 * A labelled form input with an error message underneath.
 *
 * Accessibility details (they matter for real users):
 *   - `<label htmlFor>` links the label to the input, so clicking the label
 *     focuses the input and screen readers read the label aloud.
 *   - `aria-invalid` + `aria-describedby` tell screen readers the field has
 *     an error and read the error text.
 * `useId()` makes a unique id per field, so two forms on one page never clash.
 */
const inputBase =
  "w-full rounded-xl border bg-white px-4 text-[0.95rem] text-ink placeholder:text-muted/60 transition-[border-color,box-shadow] duration-150 focus:outline-none focus:ring-4";

function FormField({ label, error, hint, optional = false, as = "input", className = "", children, ...props }) {
  const id = useId();
  const messageId = `${id}-message`;
  const Tag = as;
  const stateClasses = error
    ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
    : "border-forest-900/12 hover:border-forest-900/25 focus:border-forest-600 focus:ring-forest-600/15";
  const sizeClasses = as === "textarea" ? "min-h-28 py-3 leading-6" : "h-12";

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-semibold text-forest-900">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Optional</span>}
      </label>
      <Tag
        id={id}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error || hint ? messageId : undefined}
        className={`${inputBase} ${stateClasses} ${sizeClasses}`}
        {...props}
      >
        {children}
      </Tag>
      {(error || hint) && (
        <p id={messageId} className={`mt-1.5 text-xs ${error ? "text-red-600" : "text-muted"}`}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

export default FormField;
