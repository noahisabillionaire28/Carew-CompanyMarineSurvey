"use client";

import { useLayoutEffect } from "react";

/**
 * Always open a page at the top on first load/refresh, instead of the browser
 * restoring the previous scroll position. Deep links with a #hash still work.
 */
export default function ScrollToTop() {
  useLayoutEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!window.location.hash) window.scrollTo(0, 0);
  }, []);
  return null;
}
