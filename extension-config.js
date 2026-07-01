// =================================================================
// Maxx's Lovable — Extension Configuration
// All keys live on our own Lovable backend. No third-party powerkits
// or gringow hosts; this build talks only to MXX_API_BASE.
// =================================================================
(function () {
  function _f(n, v) {
    try { Object.defineProperty(window, n, { configurable: false, writable: false, value: v }); } catch (e) {}
  }

  // Our Lovable backend (TanStack server routes under /api/public/*).
  var API_BASE = "https://unlimitedprompts.lovable.app";

  _f("EXTENSION_NAME", "Maxx's Lovable — Unlimited");
  _f("EXTENSION_VERSION", "2.0.0");
  _f("DEFAULT_LICENSE_USER_NAME", "Maxx's Lovable User");

  // Single source of truth for all backend calls.
  _f("MXX_API_BASE", API_BASE);
  _f("MXX_VALIDATE_URL", API_BASE + "/api/public/validate-license");
  _f("MXX_UPLOAD_URL", API_BASE + "/api/public/upload-asset");
  _f("MXX_TRACK_URL", API_BASE + "/api/public/track-event");

  _f("SEND_STRATEGY", "native");
  _f("MXX_DEBUG", false);
})();

function extensionVersionShort() {
  return typeof EXTENSION_VERSION !== "undefined" ? String(EXTENSION_VERSION) : "0.0.0";
}

function extensionFooterBadge() {
  var name = typeof EXTENSION_NAME !== "undefined" ? String(EXTENSION_NAME) : "Maxx's Lovable";
  return name + " • v" + extensionVersionShort();
}

function normalizeLicenseUserName(name) {
  var n = String(name || "").trim();
  if (!n || n.toLowerCase() === "test" || n.toLowerCase() === "user") {
    return typeof DEFAULT_LICENSE_USER_NAME !== "undefined" ? DEFAULT_LICENSE_USER_NAME : "Maxx's Lovable User";
  }
  return n;
}

function mxxLicenseSessionStorage(sessionId, userName) {
  return new Promise(function (resolve) {
    chrome.storage.local.get(["mxx_license_key"], function (res) {
      resolve({
        ql_license_valid: true,
        ql_license_key: res.mxx_license_key || "UNLIMITED",
        ql_session_id: sessionId,
        ql_user_name: normalizeLicenseUserName(userName),
        ql_activated_at: new Date().toISOString(),
      });
    });
  });
}

// Back-compat shims — kept only so other modules don't crash before being
// migrated; they intentionally do nothing useful.
function powerkitsApiHeaders(extra) { return Object.assign({}, extra || {}); }
function gringowApiHeaders(extra) { return Object.assign({}, extra || {}); }
function powerkitsInternalSessionStorage() { return {}; }
function gringowInternalSessionStorage() { return {}; }
function pkPageStorageGet(suffix) {
  try { return localStorage.getItem("mxx_" + suffix) || ""; } catch (e) { return ""; }
}
function pkPageStorageSet(suffix, value) {
  try { localStorage.setItem("mxx_" + suffix, value); } catch (e) {}
}

// =================================================================
// Send / Upload telemetry — fire-and-forget POST to our backend.
// Called from content.js and sidepanel.js whenever the user clicks Send
// or uploads an asset. Never blocks the user action.
// =================================================================
function mxxTrackEvent(eventType, extra) {
  try {
    chrome.storage.local.get(["mxx_license_key", "mxx_device_id"], function (res) {
      var key = res.mxx_license_key || "UNLIMITED";
      var body = Object.assign(
        {
          key: key,
          event_type: eventType,
          device_id: res.mxx_device_id || null,
        },
        extra || {},
      );
      try {
        fetch(typeof MXX_TRACK_URL !== "undefined" ? MXX_TRACK_URL : "", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          keepalive: true,
        }).catch(function () {});
      } catch (e) {}
    });
  } catch (e) {}
}

// =================================================================
// Asset upload — Store file as data URL for unlimited mode
// In production, this would POST to backend storage, but for unlimited
// mode we generate a data URL that can be used inline.
// =================================================================
async function mxxUploadAsset(file) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var dataUrl = e.target.result;
        var fileId = "file_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
        resolve({
          file_id: fileId,
          file_name: file.name || "upload",
          public_url: dataUrl
        });
      } catch(err) {
        reject(new Error("Failed to process file: " + err.message));
      }
    };
    reader.onerror = function() {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}
