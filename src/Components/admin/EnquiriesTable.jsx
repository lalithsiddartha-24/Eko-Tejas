import { Mail, Phone } from "lucide-react";
import { useState } from "react";
import { useAdminList, useStatusChange } from "../../hooks/useAdminList";
import { ActionError, FilterChips, ListBox, ListHeader, Pagination, StatusActions, StatusBadge } from "./AdminListParts";

/**
 * Admin enquiries list: filter by status AND by topic, page through, change status.
 *
 * Talks to the backend you built in Module 4:
 *   GET   /api/enquiries?status=new&type=pricing&page=1&limit=10  -> listEnquiries
 *   PATCH /api/enquiries/:id/status  { status }                    -> updateEnquiryStatus
 *
 * Compare with BookingsTable.jsx: same shape, different details.
 *   - statuses: new -> contacted -> closed (not pending/confirmed/...)
 *   - a SECOND filter: the enquiry type (pricing, finance...)
 *   - shows the message and when it arrived, instead of a date + time slot
 */

const PATH = "/api/enquiries";
const PAGE_SIZE = 10;

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

// The same list as ENQUIRY_TYPES in enquiry.validation.js.
const TYPE_FILTERS = [
  { value: "", label: "All topics" },
  { value: "general", label: "General" },
  { value: "pricing", label: "Pricing" },
  { value: "finance", label: "Finance" },
  { value: "dealership", label: "Dealership" },
  { value: "service", label: "Service" },
];

// A copy of the backend's ALLOWED_STATUS_CHANGES for enquiries (only to show buttons).
const NEXT_ACTIONS = {
  new: [
    { status: "contacted", label: "Mark contacted" },
    { status: "closed", label: "Close", danger: true },
  ],
  contacted: [{ status: "closed", label: "Close" }],
  closed: [],
};

const STATUS_STYLES = {
  new: "bg-amber-50 text-amber-800 ring-amber-200",
  contacted: "bg-sky-50 text-sky-800 ring-sky-200",
  closed: "bg-neutral-100 text-neutral-600 ring-neutral-200",
};

// created_at is a full timestamp ("2026-11-22T10:15:00Z"), shown in Indian time.
const prettyDateTime = (iso) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" });

function EnquiriesTable() {
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [page, setPage] = useState(1);

  // GET /api/enquiries?status=...&type=...&page=...&limit=10  (with the token)
  const list = useAdminList(PATH, { status, type, page, limit: PAGE_SIZE });
  const statusChange = useStatusChange(PATH, list.reload);

  // Any filter change starts again from page 1.
  const chooseStatus = (value) => {
    setStatus(value);
    setPage(1);
    statusChange.clearError();
  };
  const chooseType = (value) => {
    setType(value);
    setPage(1);
    statusChange.clearError();
  };

  const filterText = [status, type].filter(Boolean).join(" · ");

  return (
    <section>
      <ListHeader
        title="Enquiries"
        total={list.pagination?.total}
        noun="enquiry"
        plural="enquiries"
        filterText={filterText}
        loading={list.loading}
        onRefresh={list.reload}
      />

      <div className="mt-5 grid gap-3">
        <FilterChips label="Filter by status" options={STATUS_FILTERS} value={status} onChange={chooseStatus} />
        <FilterChips label="Filter by topic" options={TYPE_FILTERS} value={type} onChange={chooseType} />
      </div>

      <ActionError message={statusChange.error} />

      <ListBox
        error={list.error && `Couldn't load enquiries: ${list.error}`}
        loading={list.loading}
        isEmpty={!list.items.length}
        loadingText="Loading enquiries…"
        emptyText="No enquiries match these filters. Messages from the contact form will appear here."
      >
        {list.items.map((enquiry) => (
          <li key={enquiry.id} className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <p className="font-semibold text-forest-950">{enquiry.customer_name}</p>
                <span className="rounded-full bg-mint-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-forest-800">
                  {enquiry.enquiry_type}
                </span>
                {enquiry.vehicle?.name && <span className="text-sm text-muted">about {enquiry.vehicle.name}</span>}
              </div>

              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                <a href={`tel:+91${enquiry.phone}`} className="inline-flex items-center gap-1 hover:text-forest-900">
                  <Phone size={13} aria-hidden="true" /> {enquiry.phone}
                </a>
                {enquiry.email && (
                  <a href={`mailto:${enquiry.email}`} className="inline-flex items-center gap-1 hover:text-forest-900">
                    <Mail size={13} aria-hidden="true" /> {enquiry.email}
                  </a>
                )}
                {enquiry.city && <span>{enquiry.city}</span>}
                <span>{prettyDateTime(enquiry.created_at)}</span>
              </p>

              {/* whitespace-pre-line keeps the customer's line breaks */}
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-ink/85">{enquiry.message}</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <StatusBadge status={enquiry.status} styles={STATUS_STYLES} />
              <StatusActions
                actions={NEXT_ACTIONS[enquiry.status]}
                busy={statusChange.busyId === enquiry.id}
                onChange={(newStatus) => statusChange.change(enquiry.id, newStatus)}
              />
            </div>
          </li>
        ))}
      </ListBox>

      <Pagination page={page} totalPages={list.pagination?.totalPages} loading={list.loading} onPage={setPage} />
    </section>
  );
}

export default EnquiriesTable;
