import { useCallback, useEffect, useState } from "react";
import { readApiJson } from "../utils/api";

/**
 * Loads the vehicle list for one category from GET /api/vehicles?category=...
 *
 * WHY a custom hook: the two-wheeler and three-wheeler pages had the same
 * 25 lines of fetch code copied twice. A hook is just a function that uses
 * React state, so both pages can share one copy.
 *
 * HOW loading is worked out: we remember WHICH request the stored result
 * belongs to (`result.key`). If it doesn't match the current request, we're
 * still loading. This avoids calling setState at the start of the effect,
 * which React's lint rules warn against (it causes an extra render).
 *
 * `retry()` bumps `attempt`, which changes the key, which re-runs the effect.
 */
export function useVehicles(category) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ key: "", vehicles: [], error: "" });
  const requestKey = `${category}#${attempt}`;

  useEffect(() => {
    const controller = new AbortController();

    fetch(`/api/vehicles?category=${encodeURIComponent(category)}`, { signal: controller.signal })
      .then(async (response) => {
        const payload = await readApiJson(response);
        if (!payload.success || !Array.isArray(payload.data)) {
          throw new Error(payload.message || `HTTP ${response.status}`);
        }
        return payload.data;
      })
      .then((vehicles) => setResult({ key: requestKey, vehicles, error: "" }))
      .catch((error) => {
        // Leaving the page cancels the request on purpose: not a real error.
        if (error.name === "AbortError") return;
        console.error(`Failed to fetch ${category} vehicles:`, error);
        setResult({
          key: requestKey,
          vehicles: [],
          error: "We couldn't load the vehicles right now. Please check your connection and try again.",
        });
      });

    // Cleanup: if the user leaves before the response arrives, cancel it.
    return () => controller.abort();
  }, [category, requestKey]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  const loading = result.key !== requestKey;

  return {
    vehicles: loading ? [] : result.vehicles,
    loading,
    error: loading ? "" : result.error,
    retry,
  };
}
