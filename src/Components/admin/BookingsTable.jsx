import { Phone } from "lucide-react";
import { useState } from "react";
import { useAdminList, useStatusChange } from "../../hooks/useAdminList";
import { ActionError, FilterChips, ListBox, ListHeader, Pagination, StatusActions, StatusBadge } from "./AdminListParts";

/**
 * Admin bookings list: filter by status, page through, change status.
 *
 * Talks to the backend you built in Module 3:
 *   GET   /api/bookings?status=pending&page=1&limit=10   -> listBookings
 *   PATCH /api/bookings/:id/status  { status }             -> updateBookingStatus
 *
 * The loading logic lives in useAdminList, the look in AdminListParts.
 * This file only says what is SPECIAL about bookings.
 */

const PATH = "/api/bookings";
const PAGE_SIZE = 10;

const FILTERS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// Which buttons to SHOW for each status. A copy of the backend's
// ALLOWED_STATUS_CHANGES, used only to hide buttons that would fail anyway.
// The backend is still the judge: if this copy were wrong, it would answer 409.
const NEXT_ACTIONS = {
  pending: [
    { status: "confirmed", label: "Confirm" },
    { status: "cancelled", label: "Cancel", danger: true },
  ],
  confirmed: [
    { status: "completed", label: "Mark done" },
    { status: "cancelled", label: "Cancel", danger: true },
  ],
  completed: [],
  cancelled: [],
};

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200",
  confirmed: "bg-sky-50 text-sky-800 ring-sky-200",
  completed: "bg-mint-100 text-forest-800 ring-forest-600/20",
  cancelled: "bg-neutral-100 text-neutral-600 ring-neutral-200",
};

const SLOT_LABELS = { morning: "Morning", afternoon: "Afternoon", evening: "Evening" };

// "2026-11-22" -> "Sun, 22 Nov". The T00:00:00 keeps it on the same day in any time zone.
const prettyDate = (iso) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });

function BookingsTable() {
  const [status, setStatus] = useState(""); // "" = all
  const [page, setPage] = useState(1);

  // GET /api/bookings?status=...&page=...&limit=10  (with the token)
  const list = useAdminList(PATH, { status, page, limit: PAGE_SIZE });
  // PATCH /api/bookings/:id/status, then reload the list
  const statusChange = useStatusChange(PATH, list.reload);

  const chooseFilter = (value) => {
    setStatus(value);
    setPage(1); // a new filter starts from page 1
    statusChange.clearError();
  };

  const changeStatus = (booking, newStatus) => {
    if (newStatus === "cancelled" && !window.confirm(`Cancel ${booking.customer_name}'s test drive?`)) return;
    statusChange.change(booking.id, newStatus);
  };

  return (
    <section>
      <ListHeader
        title="Test drive bookings"
        total={list.pagination?.total}
        noun="booking"
        filterText={status}
        loading={list.loading}
        onRefresh={list.reload}
      />

      <div className="mt-5">
        <FilterChips label="Filter by status" options={FILTERS} value={status} onChange={chooseFilter} />
      </div>

      <ActionError message={statusChange.error} />

      <ListBox
        error={list.error && `Couldn't load bookings: ${list.error}`}
        loading={list.loading}
        isEmpty={!list.items.length}
        loadingText="Loading bookings…"
        emptyText={`No ${status} bookings yet. New test drive requests will appear here.`}
      >
        {list.items.map((booking) => (
          <li key={booking.id} className="grid gap-4 p-5 sm:grid-cols-[1.3fr_1fr_auto] sm:items-center">
            {/* Who */}
            <div className="min-w-0">
              <p className="font-semibold text-forest-950">{booking.customer_name}</p>
              <p className="mt-0.5 flex flex-wrap items-center gap-x-3 text-sm text-muted">
                <a href={`tel:+91${booking.phone}`} className="inline-flex items-center gap-1 hover:text-forest-900">
                  <Phone size={13} aria-hidden="true" /> {booking.phone}
                </a>
                <span>{booking.city}</span>
              </p>
              {booking.message && <p className="mt-2 text-sm text-ink/80">&ldquo;{booking.message}&rdquo;</p>}
            </div>

            {/* What and when */}
            <div className="text-sm">
              <p className="font-semibold text-forest-900">{booking.vehicle?.name || "Unknown vehicle"}</p>
              <p className="text-muted">
                {prettyDate(booking.preferred_date)} · {SLOT_LABELS[booking.preferred_time_slot]}
              </p>
            </div>

            {/* Status and actions */}
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <StatusBadge status={booking.status} styles={STATUS_STYLES} />
              <StatusActions
                actions={NEXT_ACTIONS[booking.status]}
                busy={statusChange.busyId === booking.id}
                onChange={(newStatus) => changeStatus(booking, newStatus)}
              />
            </div>
          </li>
        ))}
      </ListBox>

      <Pagination page={page} totalPages={list.pagination?.totalPages} loading={list.loading} onPage={setPage} />
    </section>
  );
}

export default BookingsTable;
