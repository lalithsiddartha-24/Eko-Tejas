import { ChevronLeft, ChevronRight, LoaderCircle, RefreshCw } from "lucide-react";
import Button from "../ui/Button";

/**
 * Small building blocks shared by the admin lists (bookings, enquiries).
 * WHY: both lists have a title, filter chips, a status badge, a loading/empty
 * box and Previous/Next. Building them once keeps both pages identical, and a
 * fix in one place fixes both.
 */

/** "Test drive bookings · 12 bookings" + a Refresh button. */
// `plural` is for words that don't just add "s" (enquiry -> enquiries).
export function ListHeader({ title, total, noun, plural = `${noun}s`, filterText, loading, onRefresh }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-forest-950">{title}</h2>
        <p className="mt-1 text-sm text-muted">
          {total === undefined ? "Loading…" : `${total} ${total === 1 ? noun : plural}`}
          {filterText && ` · ${filterText}`}
        </p>
      </div>
      <Button variant="outline" onClick={onRefresh} disabled={loading}>
        <RefreshCw size={15} className={loading ? "animate-spin" : ""} /> Refresh
      </Button>
    </div>
  );
}

/** A row of pill buttons. `options` = [{ value, label }], "" means "All". */
export function FilterChips({ label, options, value, onChange }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
            value === option.value
              ? "bg-forest-950 text-white"
              : "border border-forest-900/12 bg-white text-forest-900 hover:border-forest-900/30"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

/** Coloured pill for a status. `styles` maps each status to its colours. */
export function StatusBadge({ status, styles }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${styles[status] || ""}`}>
      {status}
    </span>
  );
}

/** The status-change buttons for one row. `actions` = [{ status, label }]. */
export function StatusActions({ actions = [], busy, onChange }) {
  return actions.map((action) => (
    <button
      key={action.status}
      type="button"
      onClick={() => onChange(action.status)}
      disabled={busy}
      className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold transition-colors disabled:opacity-50 ${
        action.danger ? "text-red-700 hover:bg-red-50" : "bg-forest-950 text-white hover:bg-forest-700"
      }`}
    >
      {busy && <LoaderCircle size={14} className="animate-spin" />}
      {action.label}
    </button>
  ));
}

/**
 * The white box around the rows. Shows exactly one of:
 * error message / "Loading…" / "nothing here" / the rows (`children`).
 */
export function ListBox({ error, loading, isEmpty, emptyText, loadingText, children }) {
  let content;
  if (error) {
    content = (
      <p role="alert" className="p-8 text-center text-sm text-red-700">
        {error}
      </p>
    );
  } else if (loading && isEmpty) {
    content = (
      <p role="status" className="flex items-center justify-center gap-2 p-10 text-sm text-muted">
        <LoaderCircle size={16} className="animate-spin" /> {loadingText}
      </p>
    );
  } else if (isEmpty) {
    content = <p className="p-10 text-center text-sm text-muted">{emptyText}</p>;
  } else {
    // Old rows stay visible (faded) while the next page loads, so the screen doesn't jump.
    content = <ul className={`divide-y divide-forest-900/8 transition-opacity ${loading ? "opacity-60" : ""}`}>{children}</ul>;
  }
  return <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-forest-900/8 bg-white">{content}</div>;
}

/** Previous · Page 2 of 5 · Next. Hidden when there's only one page. */
export function Pagination({ page, totalPages, loading, onPage }) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <nav aria-label="Pages" className="mt-5 flex items-center justify-between gap-4">
      <Button variant="outline" onClick={() => onPage(page - 1)} disabled={page <= 1 || loading}>
        <ChevronLeft size={16} /> Previous
      </Button>
      <p className="text-sm text-muted">
        Page {page} of {totalPages}
      </p>
      <Button variant="outline" onClick={() => onPage(page + 1)} disabled={page >= totalPages || loading}>
        Next <ChevronRight size={16} />
      </Button>
    </nav>
  );
}

/** Red banner for a failed status change (e.g. a 409 conflict). */
export function ActionError({ message }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </p>
  );
}
