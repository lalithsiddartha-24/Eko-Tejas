import { useEffect, useState } from "react";
import { adminFetch } from "../utils/adminApi";

/**
 * Loads one page of an admin list (bookings, enquiries...) from our backend.
 *
 *   const list = useAdminList("/api/bookings", { status: "pending", page: 1, limit: 10 });
 *   list.items, list.pagination, list.loading, list.error, list.reload()
 *
 * WHY a shared hook: bookings and enquiries load their lists the SAME way
 * (GET + page/limit/filters, answer = { items, pagination }). Piece 2 wrote this
 * logic inside BookingsTable. Piece 3 needs it again, so it moves here once.
 * Same idea as the backend's common.validation.js: write it once, reuse it.
 */
export function useAdminList(path, query) {
  // Bumping this number loads the list again (after a status change, or "Refresh").
  const [reloadCount, setReloadCount] = useState(0);

  // { status: "", page: 2, limit: 10 } -> "page=2&limit=10"  (empty filters are left out)
  const queryString = new URLSearchParams(
    Object.entries(query)
      .filter(([, value]) => value !== "" && value !== undefined && value !== null)
      .map(([key, value]) => [key, String(value)])
  ).toString();

  // One string that changes whenever we need different data.
  const requestKey = `${path}?${queryString}#${reloadCount}`;

  // The last answer from the backend, tagged with WHICH request it answers.
  const [result, setResult] = useState({ key: "", items: [], pagination: null, error: "" });

  useEffect(() => {
    let ignore = false; // set when this request is outdated (filter/page changed again)

    adminFetch(`${path}?${queryString}`)
      .then((payload) => {
        if (!ignore) setResult({ key: requestKey, ...payload.data, error: "" });
      })
      .catch((error) => {
        if (!ignore) setResult({ key: requestKey, items: [], pagination: null, error: error.message });
      });

    // WHY: if the manager clicks "Pending" then quickly "Confirmed", the slow
    // "Pending" answer may arrive last. `ignore` stops it from overwriting.
    return () => {
      ignore = true;
    };
  }, [path, queryString, requestKey]);

  return {
    items: result.items,
    pagination: result.pagination,
    error: result.error,
    // WHY loading is worked out instead of stored: if the answer we hold is for
    // an older request, we're still waiting for the new one.
    loading: result.key !== requestKey,
    reload: () => setReloadCount((n) => n + 1),
  };
}

/**
 * The "change status" button logic, shared by bookings and enquiries.
 *
 *   const status = useStatusChange("/api/enquiries", list.reload);
 *   status.change(enquiry.id, "contacted");
 *   status.busyId, status.error
 *
 * Sends PATCH {path}/{id}/status { status }, then reloads the list.
 */
export function useStatusChange(path, reload) {
  const [busyId, setBusyId] = useState(null); // row whose button is working
  const [error, setError] = useState("");

  const change = async (id, newStatus) => {
    setBusyId(id);
    setError("");
    try {
      await adminFetch(`${path}/${id}/status`, { method: "PATCH", body: { status: newStatus } });
    } catch (err) {
      // e.g. 409 "This booking was just changed by someone else": show it.
      setError(err.message);
    } finally {
      setBusyId(null);
      // Reload either way: on success to show the new status, on a 409 to show the real one.
      reload();
    }
  };

  return { busyId, error, change, clearError: () => setError("") };
}
