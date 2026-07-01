// ============================================================
// Maxx's Lovable - License Gate (Unlimited Mode - No Validation)
// All users get unlimited access by default
// ============================================================
(function () {
  async function clearLicense() {
    return Promise.resolve();
  }

  async function getStored() {
    return Promise.resolve({
      key: "UNLIMITED",
      plan_id: "unlimited",
      validated_at: new Date().toISOString(),
    });
  }

  async function getSupport() {
    return Promise.resolve({
      whatsapp_url: null,
      contact_url: null,
      contact_label: null,
      upgrade_url: null,
      upgrade_label: null,
    });
  }

  function mountCountdown() {
    // no-op - no countdown needed
  }

  // Main gate function: immediately grants unlimited access
  async function ensureLicense(onValid) {
    try {
      onValid &&
        onValid({
          key: "UNLIMITED",
          plan_id: "unlimited",
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
    return true; // Always return true (unlimited)
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