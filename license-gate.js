// ============================================================
// Maxx's Lovable - License Gate (Disabled)
// This module has been simplified to bypass all licensing checks.
// ============================================================
(function () {
  // Stub implementations that do nothing or return success

  async function clearLicense() {
    return Promise.resolve();
  }

  async function getStored() {
    return Promise.resolve({});
  }

  async function getSupport() {
    return Promise.resolve({
      whatsapp_url: null,
      contact_url: null,
      contact_label: null,
      upgrade_url: null,
      upgrade_label: "Upgrade",
    });
  }

  function mountCountdown() {
    // no-op
  }

  // Main gate function: immediately calls onValid with a dummy license object
  async function ensureLicense(onValid) {
    try {
      onValid && onValid({
        key: "UNLICENSED",
        activated_at: new Date().toISOString(),
        expires_at: "2099-12-31T23:59:59Z",
      });
    } catch (e) {
      console.error("License gate error:", e);
    }
  }

  async function ensureLicenseWithCountdown(onValid) {
    return ensureLicense(onValid);
  }

  async function quickCheck() {
    return true; // Always return true (licensed)
  }

  function onLockChange() {
    // no-op
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
