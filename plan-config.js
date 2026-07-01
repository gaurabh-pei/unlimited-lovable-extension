// =================================================================
// Maxx's Lovable — Plan Tier Configuration
// Defines feature access levels for Free, Pro, and Unlimited plans
// =================================================================
(function () {
  const PLAN_TIERS = {
    FREE: {
      id: "free",
      name: "Free",
      description: "Limited features",
      limits: {
        uploads_per_day: 5,
        max_file_size_mb: 5,
        prompt_optimizations_per_day: 3,
        max_prompts_stored: 10,
      },
      features: {
        basic_prompt_craft: true,
        side_panel_access: true,
        history: true,
        theme_customization: true,
        asset_upload: false,
        bulk_upload: false,
        prompt_optimization: false,
        advanced_analytics: false,
        api_access: false,
      },
    },
    PRO: {
      id: "pro",
      name: "Pro",
      description: "Enhanced features",
      limits: {
        uploads_per_day: 50,
        max_file_size_mb: 25,
        prompt_optimizations_per_day: 100,
        max_prompts_stored: 500,
      },
      features: {
        basic_prompt_craft: true,
        side_panel_access: true,
        history: true,
        theme_customization: true,
        asset_upload: true,
        bulk_upload: true,
        prompt_optimization: true,
        advanced_analytics: true,
        api_access: false,
      },
    },
    UNLIMITED: {
      id: "unlimited",
      name: "Unlimited",
      description: "All features, unlimited access",
      limits: {
        uploads_per_day: null,
        max_file_size_mb: 100,
        prompt_optimizations_per_day: null,
        max_prompts_stored: null,
      },
      features: {
        basic_prompt_craft: true,
        side_panel_access: true,
        history: true,
        theme_customization: true,
        asset_upload: true,
        bulk_upload: true,
        prompt_optimization: true,
        advanced_analytics: true,
        api_access: true,
        priority_support: true,
        custom_branding: true,
      },
    },
  };

  function getPlanTier(planId) {
    const tier = Object.values(PLAN_TIERS).find(
      (p) => p.id === (planId || "").toLowerCase()
    );
    return tier || PLAN_TIERS.FREE;
  }

  function hasFeature(planId, featureName) {
    const tier = getPlanTier(planId);
    return tier.features[featureName] === true;
  }

  function checkLimit(planId, limitName, currentValue) {
    const tier = getPlanTier(planId);
    const limit = tier.limits[limitName];
    if (limit === null) return true;
    return currentValue < limit;
  }

  function getFeaturesList(planId) {
    const tier = getPlanTier(planId);
    return Object.entries(tier.features)
      .filter(([_, enabled]) => enabled)
      .map(([feature]) => feature);
  }

  window.MxxPlans = {
    TIERS: PLAN_TIERS,
    getPlanTier,
    hasFeature,
    checkLimit,
    getFeaturesList,
  };
})();