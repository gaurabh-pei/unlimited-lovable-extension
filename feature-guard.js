// =================================================================
// Maxx's Lovable — Feature Guard
// Enforces feature access based on plan tier
// =================================================================
(function () {
  let currentLicense = null;

  function setCurrentLicense(license) {
    currentLicense = license;
  }

  function hasFeature(featureName) {
    if (!currentLicense) return false;
    if (!window.MxxPlans) return false;

    return window.MxxPlans.hasFeature(currentLicense.plan_id, featureName);
  }

  function checkLimit(limitName, currentValue = 0) {
    if (!currentLicense) return false;
    if (!window.MxxPlans) return false;

    return window.MxxPlans.checkLimit(
      currentLicense.plan_id,
      limitName,
      currentValue
    );
  }

  function getPlanTier() {
    if (!currentLicense) return window.MxxPlans.TIERS.FREE;
    return window.MxxPlans.getPlanTier(currentLicense.plan_id);
  }

  function showFeatureLockedUI(featureName, elementId) {
    const element = document.getElementById(elementId);
    if (!element || hasFeature(featureName)) return;

    element.innerHTML = `
      <div class="mxx-feature-locked">
        <svg class="mxx-lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <h3>Feature Locked</h3>
        <p>${featureName} is available on Pro and Unlimited plans only.</p>
        <button class="mxx-upgrade-btn" onclick="window.open('https://unlimitedprompts.lovable.app/upgrade', '_blank')">
          Upgrade Now
        </button>
      </div>
    `;
    element.style.display = "flex";
    element.style.alignItems = "center";
    element.style.justifyContent = "center";
    element.style.minHeight = "200px";
  }

  function disableFeatureButton(buttonElement, featureName) {
    if (!hasFeature(featureName)) {
      buttonElement.disabled = true;
      buttonElement.title = `${featureName} requires Pro or Unlimited plan`;
      buttonElement.style.opacity = "0.6";
      buttonElement.style.cursor = "not-allowed";
      buttonElement.addEventListener("click", (e) => {
        e.preventDefault();
        alert(
          `${featureName} is available on Pro and Unlimited plans. Upgrade now!`
        );
      });
    }
  }

  function getPlanBadgeHTML() {
    const tier = getPlanTier();
    const badgeColors = {
      free: "#94a3b8",
      pro: "#3b82f6",
      unlimited: "#f59e0b",
    };
    const color = badgeColors[tier.id] || badgeColors.free;

    return `
      <span class="mxx-plan-badge" style="
        background-color: ${color};
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      ">
        ${tier.name}
      </span>
    `;
  }

  function showUpgradePrompt(featureName) {
    const tier = getPlanTier();
    if (tier.id === "unlimited") return;

    const message = `
📦 ${featureName} is a Premium Feature

Current Plan: ${tier.name}
Upgrade to unlock all features!

👉 Upgrade Now
    `;

    if (window.showNotification) {
      window.showNotification({
        type: "info",
        title: "Premium Feature",
        message: `${featureName} requires an upgrade`,
      });
    } else {
      alert(message);
    }
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