(() => {
  "use strict";
  const API_BASE = "https://visitor-indexer.aryanavery1488.workers.dev";
  const STORAGE_KEY = "visitor_index_id_v1";

  function getVisitorId() {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = "v_" + (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2));
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  }

  function safePage(value) {
    try {
      const u = new URL(value);
      return u.origin + u.pathname;
    } catch (_) {
      return null;
    }
  }

  const payload = {
    visitor_id: getVisitorId(),
    page: safePage(location.href),
    referrer: safePage(document.referrer),
    language: navigator.language || null,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
    screen: { width: screen.width || null, height: screen.height || null },
    first_party_notice: true
  };

  window.__visitorTrackingPromise = fetch(API_BASE + "/api/visit", {
    method: "POST",
    mode: "cors",
    credentials: "omit",
    cache: "no-store",
    keepalive: true,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => null);
})();