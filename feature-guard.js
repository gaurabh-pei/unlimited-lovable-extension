// =================================================================
// Maxx's Lovable — Feature Guard (Unlimited Mode)
// All features unlocked by default - no restrictions
// =================================================================
(function () {
  let currentLicense = {
    plan_id: "unlimited",
    key: "UNLIMITED",
  };

  function setCurrentLicense(license) {
    currentLicense = license || { plan_id: "unlimited", key: "UNLIMITED" };
  }

  function hasFeature(featureName) {
    // All features enabled in unlimited mode
    return true;
  }

  function checkLimit(limitName, currentValue = 0) {
    // No limits in unlimited mode
    return true;
  }

  function getPlanTier() {
    return window.MxxPlans ? window.MxxPlans.TIERS.UNLIMITED : { id: "unlimited", name: "Unlimited" };
  }

  function showFeatureLockedUI(featureName, elementId) {
    // No locked features - do nothing
    return;
  }

  function disableFeatureButton(buttonElement, featureName) {
    // All buttons enabled - do nothing
    return;
  }

  function getPlanBadgeHTML() {
    return `
      <span class="mxx-plan-badge" style="
        background-color: #f59e0b;
        color: white;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      ">
        ⚡ Unlimited
      </span>
    `;
  }

  function showUpgradePrompt(featureName) {
    // No upgrade prompts needed
    return;
  }

  window.MxxFeatureGuard = {
    setCurrentLicense,
    hasFeature,
    checkLimit,
    getPlanTier,
    showFeatureLockedUI,
    disableFeatureButton,
    getPlanBadgeHTML,
    showUpgradePrompt,
  };
})();