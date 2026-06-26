// ============================================================
// Maxx's Lovable - License Gate
// Validates a user-entered license key against the Lovable backend.
// Server: POST /api/public/validate-license  { key, device_id }
// ============================================================
(function () {
  const LICENSE_API_URL =
    "https://unlimitedprompts.lovable.app/api/public/validate-license";

  // Re-validate at most once per 5 min while a stored key is locally fresh.
  // (Server throttles its own writes to 5 min, so polls past this window are
  // still cheap read-only lookups.)
  const REVALIDATE_MS = 5 * 60 * 1000;

  const STORAGE_KEYS = [
    "mxx_license_key",
    "mxx_license_activated_at",
    "mxx_license_expires_at",
    "mxx_license_last_validated_at",
    "mxx_support_whatsapp_url",
    "mxx_support_contact_url",
    "mxx_support_contact_label",
  ];

  const FALLBACK_SUPPORT_URL = "https://whatsapp.com/channel/0029Vb7jGDG5a245baPA9H3y";

  function getDeviceIdLocal() {
    return new Promise((resolve) => {
      chrome.storage.local.get(["mxx_device_id"], (res) => {
        if (res.mxx_device_id) return resolve(res.mxx_device_id);
        const id =
          (crypto && crypto.randomUUID && crypto.randomUUID()) ||
          "dev-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
        chrome.storage.local.set({ mxx_device_id: id }, () => resolve(id));
      });
    });
  }

  function getStored() {
    return new Promise((resolve) => {
      chrome.storage.local.get(STORAGE_KEYS, (res) => resolve(res || {}));
    });
  }

  async function validateOnServer(key) {
    const device_id = await getDeviceIdLocal();
    const fingerprint = (window.MxxTamperGuard && window.MxxTamperGuard.manifestFingerprint)
      ? window.MxxTamperGuard.manifestFingerprint()
      : { name: null, version: null };

    const resp = await fetch(LICENSE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: String(key || "").trim(),
        device_id,
        manifest_name: fingerprint.name,
        manifest_version: fingerprint.version,
      }),
    });
    let body = {};
    try { body = await resp.json(); } catch (e) {}

    // Verify Ed25519 signature on success. A forged response trips lockdown
    // and the activation fails as if invalid.
    if (resp.ok && body.valid === true && window.MxxTamperGuard && window.MxxTamperGuard.verifyLicenseSignature) {
      const reason = await window.MxxTamperGuard.verifyLicenseSignature({
        key: body.key,
        device_id,
        expires_at: body.expires_at,
        activated_at: body.activated_at,
        issued_at: body.issued_at,
        status: "active",
        signature: body.signature,
      });
      if (reason && reason !== "missing_signature") {
        window.MxxTamperGuard.lockdown(reason);
        return { ok: false, status: 403, body: { valid: false, reason: "tamper_signature_invalid" } };
      }
    }
    return { ok: resp.ok && body.valid === true, status: resp.status, body };
  }

  async function persistValid(body) {
    const supportPatch = {};
    if (body && body.support) {
      supportPatch.mxx_support_whatsapp_url = body.support.whatsapp_url || null;
      supportPatch.mxx_support_contact_url = body.support.contact_url || null;
      supportPatch.mxx_support_contact_label = body.support.contact_label || null;
    }
    return new Promise((resolve) => {
      chrome.storage.local.set(
        Object.assign({
          mxx_license_key: body.key,
          mxx_license_activated_at: body.activated_at,
          mxx_license_expires_at: body.expires_at,
          mxx_license_last_validated_at: new Date().toISOString(),
        }, supportPatch),
        resolve,
      );
    });
  }

  async function clearLicense() {
    return new Promise((resolve) => chrome.storage.local.remove(STORAGE_KEYS, resolve));
  }

  async function getSupport() {
    return new Promise((resolve) => {
      chrome.storage.local.get(
        ["mxx_support_whatsapp_url", "mxx_support_contact_url", "mxx_support_contact_label"],
        (res) => {
          const url = (res && (res.mxx_support_contact_url || res.mxx_support_whatsapp_url)) || FALLBACK_SUPPORT_URL;
          const label = (res && res.mxx_support_contact_label) || "Upgrade";
          resolve({
            whatsapp_url: (res && res.mxx_support_whatsapp_url) || null,
            contact_url: (res && res.mxx_support_contact_url) || null,
            contact_label: (res && res.mxx_support_contact_label) || null,
            upgrade_url: url,
            upgrade_label: label,
          });
        },
      );
    });
  }

  function supportHtml(support) {
    if (!support) return "";
    var parts = [];
    if (support.whatsapp_url) {
      parts.push(
        '<a href="' + support.whatsapp_url + '" target="_blank" rel="noopener" ' +
        'style="display:inline-flex;align-items:center;gap:4px;padding:6px 10px;border-radius:6px;' +
        'background:#25D366;color:#fff;text-decoration:none;font-size:12px;font-weight:600">💬 WhatsApp</a>',
      );
    }
    if (support.contact_url) {
      parts.push(
        '<a href="' + support.contact_url + '" target="_blank" rel="noopener" ' +
        'style="display:inline-flex;align-items:center;gap:4px;padding:6px 10px;border-radius:6px;' +
        'background:var(--ql-bg-2,#2a2a2a);color:inherit;text-decoration:none;font-size:12px;font-weight:600;' +
        'border:1px solid var(--ql-border,#3a3a3a)">' +
        (support.contact_label || "Contact") + "</a>",
      );
    }
    if (!parts.length) return "";
    return (
      '<div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--ql-border,#3a3a3a);text-align:center">' +
      '<p style="margin:0 0 8px;font-size:11px;color:var(--ql-text-muted,#888)">Need help?</p>' +
      '<div style="display:flex;gap:6px;justify-content:center;flex-wrap:wrap">' +
      parts.join("") +
      "</div></div>"
    );
  }

  function renderGate(opts) {
    const body = document.getElementById("sp-body");
    if (!body) return;
    const initialMsg = opts && opts.message ? opts.message : "";
    const initialSupport = (opts && opts.support) || null;
    body.innerHTML =
      '<div class="mxx-lic-wrap" style="padding:24px 18px;max-width:340px;margin:0 auto;font-family:inherit">' +
      '  <div style="text-align:center;margin-bottom:18px">' +
      '    <div style="font-size:32px;line-height:1">🔑</div>' +
      '    <h2 style="margin:8px 0 4px;font-size:16px">License required</h2>' +
      '    <p style="margin:0;font-size:12px;color:var(--ql-text-muted, #888)">Enter your license key to activate this extension.</p>' +
      "  </div>" +
      '  <input id="mxx-lic-input" type="text" autocomplete="off" spellcheck="false" placeholder="XXXXX-XXXXX-XXXXX-XXXXX" ' +
      '    style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--ql-border,#3a3a3a);background:var(--ql-bg-2,#1c1c1c);color:inherit;font-family:ui-monospace,Menlo,monospace;font-size:13px;letter-spacing:1px;text-transform:uppercase;text-align:center" />' +
      '  <button id="mxx-lic-btn" style="margin-top:10px;width:100%;padding:10px 12px;border:0;border-radius:8px;background:#7c5cff;color:#fff;font-weight:600;cursor:pointer">Validate</button>' +
      '  <p id="mxx-lic-msg" style="margin-top:10px;min-height:16px;font-size:12px;text-align:center;color:#ff7a7a">' + initialMsg + "</p>" +
      '  <div style="margin-top:14px;display:flex;flex-direction:column;align-items:center;gap:8px">' +
      '    <span style="font-size:11px;color:var(--ql-text-muted,#888)">Need a key?</span>' +
      '    <a id="mxx-lic-contact-admin" href="#" target="_blank" rel="noopener" ' +
      '       style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;' +
      '              background:#7c5cff;color:#fff;text-decoration:none;font-size:12px;font-weight:600">' +
      '       💬 Contact admin</a>' +
      '  </div>' +
      '  <div id="mxx-lic-support">' + supportHtml(initialSupport) + '</div>' +
      "</div>";

    const input = document.getElementById("mxx-lic-input");
    const btn = document.getElementById("mxx-lic-btn");
    const msg = document.getElementById("mxx-lic-msg");
    const supportEl = document.getElementById("mxx-lic-support");

    input.focus();
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") btn.click(); });

    // Wire the "Contact admin" button to admin-configured support URL (with fallback).
    (async () => {
      try {
        const sup = await getSupport();
        const link = document.getElementById("mxx-lic-contact-admin");
        if (link) link.href = sup.upgrade_url || FALLBACK_SUPPORT_URL;
      } catch (e) {}
    })();

    btn.addEventListener("click", async () => {
      const key = (input.value || "").trim().toUpperCase();
      if (!key) { msg.textContent = "Please enter a license key."; return; }
      btn.disabled = true;
      btn.textContent = "Validating...";
      msg.style.color = "#ff7a7a";
      msg.textContent = "";
      try {
        const { ok, body } = await validateOnServer(key);
        if (ok) {
          await persistValid(body);
          msg.style.color = "#7cffa3";
          msg.textContent = "Activated ✓";
          setTimeout(() => opts && opts.onValid && opts.onValid(body), 400);
          return;
        }
        const reasonMap = {
          not_found: "Invalid license key.",
          revoked: "This license has been revoked.",
          paused: "This license is paused. Contact admin.",
          expired: "This license has expired.",
          device_mismatch: "This key is already in use on another device.",
          invalid_input: "Key format looks wrong.",
          server_error: "Server error. Try again in a moment.",
        };
        msg.textContent = reasonMap[body && body.reason] || "Validation failed.";
        if (body && body.support) supportEl.innerHTML = supportHtml(body.support);
      } catch (e) {
        msg.textContent = "Network error. Check your connection.";
      } finally {
        btn.disabled = false;
        btn.textContent = "Validate";
      }
    });
  }

  // Public: check stored license, optionally re-validate online, then call onValid()
  // or render the gate UI.
  async function ensureLicense(onValid) {
    const stored = await getStored();
    const now = Date.now();
    const expiresMs = stored.mxx_license_expires_at
      ? Date.parse(stored.mxx_license_expires_at)
      : 0;
    const lastValMs = stored.mxx_license_last_validated_at
      ? Date.parse(stored.mxx_license_last_validated_at)
      : 0;

    // No key stored -> show gate.
    if (!stored.mxx_license_key) return renderGate({ onValid });

    // Locally expired -> force re-entry.
    if (expiresMs && expiresMs < now) {
      await clearLicense();
      return renderGate({ onValid, message: "Your license has expired." });
    }

    // Locally fresh: skip server hit (offline friendly).
    if (lastValMs && now - lastValMs < REVALIDATE_MS) {
      return onValid({
        key: stored.mxx_license_key,
        activated_at: stored.mxx_license_activated_at,
        expires_at: stored.mxx_license_expires_at,
      });
    }

    // Re-validate with the server.
    try {
      const { ok, body } = await validateOnServer(stored.mxx_license_key);
      if (ok) { await persistValid(body); return onValid(body); }
      // Server rejected -> force re-entry with a reason.
      await clearLicense();
      const reasonMap = {
        revoked: "Your license has been revoked.",
        paused: "Your license is paused. Contact admin.",
        expired: "Your license has expired.",
        device_mismatch: "This key is bound to another device.",
        not_found: "License no longer exists.",
      };
      return renderGate({
        onValid,
        message: reasonMap[body && body.reason] || "License is no longer valid.",
        support: body && body.support,
      });
    } catch (e) {
      // Network failure: trust the local copy if it isn't expired.
      return onValid({
        key: stored.mxx_license_key,
        activated_at: stored.mxx_license_activated_at,
        expires_at: stored.mxx_license_expires_at,
      });
    }
  }

  // Mount a small countdown chip into the header so users always see remaining time.
  function mountCountdown(expiresAtIso) {
    if (!expiresAtIso) return;
    try {
      var header = document.querySelector(".sp-header-actions") || document.querySelector(".sp-header");
      if (!header) return;
      var existing = document.getElementById("mxx-lic-countdown");
      if (existing) existing.remove();
      var chip = document.createElement("div");
      chip.id = "mxx-lic-countdown";
      chip.title = "License time remaining";
      chip.style.cssText =
        "display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:999px;" +
        "font-family:ui-monospace,Menlo,monospace;font-size:11px;line-height:1;" +
        "background:var(--ql-bg-2,#1c1c1c);color:var(--ql-text,#ddd);" +
        "border:1px solid var(--ql-border,#3a3a3a);margin-right:4px;cursor:default;user-select:none";
      header.insertBefore(chip, header.firstChild);

      var target = Date.parse(expiresAtIso);
      function tick() {
        var ms = target - Date.now();
        if (isNaN(target)) { chip.textContent = "—"; return; }
        if (ms <= 0) {
          chip.textContent = "⏱ expired";
          chip.style.color = "#ff7a7a";
          chip.style.borderColor = "#ff7a7a";
          clearInterval(timer);
          // Disable the send button immediately so no further prompts can fire.
          try {
            var sendBtn = document.getElementById("sp-send");
            if (sendBtn) { sendBtn.disabled = true; sendBtn.title = "License expired"; }
          } catch (e) {}
          // Clear the stored license. Storage change fires onLockChange in the
          // side panel, which re-runs MxxLicense.ensure() and shows the
          // validate-license screen.
          try { clearLicense(); } catch (e) {}
          return;
        }
        var d = Math.floor(ms / 86400000);
        var h = Math.floor((ms % 86400000) / 3600000);
        var m = Math.floor((ms % 3600000) / 60000);
        var s = Math.floor((ms % 60000) / 1000);
        var pad = function (n) { return String(n).padStart(2, "0"); };
        var label = d > 0
          ? "⏱ " + d + "d " + pad(h) + ":" + pad(m) + ":" + pad(s)
          : "⏱ " + pad(h) + ":" + pad(m) + ":" + pad(s);
        chip.textContent = label;
        // Warning tint in last 24h.
        if (ms < 86400000) {
          chip.style.color = "#ffcc66";
          chip.style.borderColor = "#ffcc66";
        }
      }
      tick();
      var timer = setInterval(tick, 1000);
    } catch (e) { /* no-op */ }
  }

  // Wrap onValid so the countdown chip mounts after any successful gate result.
  var originalEnsure = ensureLicense;
  async function ensureLicenseWithCountdown(onValid) {
    return originalEnsure(function (body) {
      mountCountdown(body && body.expires_at);
      try { onValid && onValid(body); } catch (e) {}
    });
  }

  // Cheap synchronous-ish gate for feature calls. Resolves true only if a
  // stored key exists and hasn't passed its local expires_at.
  async function quickCheck() {
    const s = await getStored();
    if (!s.mxx_license_key) return false;
    const exp = s.mxx_license_expires_at ? Date.parse(s.mxx_license_expires_at) : 0;
    if (exp && exp < Date.now()) {
      await clearLicense();
      return false;
    }
    return true;
  }

  // Live-lock: when storage is cleared (by the background heartbeat, another
  // tab, or expiry), force the gate to re-render immediately.
  function onLockChange(handler) {
    try {
      chrome.storage.onChanged.addListener(function (changes, area) {
        if (area !== "local") return;
        if (changes.mxx_license_key && !changes.mxx_license_key.newValue) {
          try { handler && handler(); } catch (e) {}
        }
      });
    } catch (e) {}
  }

  window.MxxLicense = {
    ensure: ensureLicenseWithCountdown,
    clear: clearLicense,
    get: getStored,
    getSupport: getSupport,
    mountCountdown: mountCountdown,
    quickCheck: quickCheck,
    onLockChange: onLockChange,
  };
})();
