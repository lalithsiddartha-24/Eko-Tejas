import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Fixes two things single-page apps get wrong by default:
 *   1. Opening a new page keeps the old scroll position (you land halfway
 *      down). We scroll to the top on every page change.
 *   2. Links like "/#contact" change the URL but don't scroll to the
 *      section. We find the element with that id and scroll to it.
 *
 * WHY the retry loop: on the vehicle page, the "#book" form only appears
 * after the vehicle data has loaded from the API. So we look for the
 * element every 100ms for up to 3 seconds, then give up quietly.
 * It renders nothing; it only runs this effect.
 */
function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return undefined;
    }

    const id = decodeURIComponent(hash.slice(1));
    let tries = 0;
    let timer;
    const tryScroll = () => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ block: "start" });
      } else if (tries++ < 30) {
        timer = window.setTimeout(tryScroll, 100);
      }
    };
    tryScroll();
    return () => window.clearTimeout(timer);
  }, [pathname, hash, key]);

  return null;
}

export default ScrollManager;
