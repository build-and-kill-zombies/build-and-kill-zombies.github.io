import type { IntegrationConfig } from "./types";
import generatedIntegrationsRaw from "../content/generated/integrations.json";

type GeneratedIntegrations = {
  gaMeasurementId?: string | null;
  googleSiteVerification?: string | null;
  bingSiteVerification?: string | null;
};

const generatedIntegrations = generatedIntegrationsRaw as GeneratedIntegrations;

// Current-site Adsterra Native Banner code (single source of truth for this domain).
const adsterraNative = {
  scriptUrl: "https://pl31582348.profitableratecpmnetwork.com/3faa209b2295e0f5f6da5d1fad59237c/invoke.js",
  containerId: "container-3faa209b2295e0f5f6da5d1fad59237c",
};

const gaFromEnv = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim() || "";
const gaFromGenerated = typeof generatedIntegrations.gaMeasurementId === "string"
  ? generatedIntegrations.gaMeasurementId.trim()
  : "";
const gaMeasurementId = gaFromEnv || gaFromGenerated || "";

const googleFromEnv = process.env.GOOGLE_SITE_VERIFICATION?.trim() || "";
const googleFromGenerated = typeof generatedIntegrations.googleSiteVerification === "string"
  ? generatedIntegrations.googleSiteVerification.trim()
  : "";
const googleVerification = googleFromEnv || googleFromGenerated || null;

const bingFromEnv = process.env.BING_SITE_VERIFICATION?.trim() || "";
const bingFromGenerated = typeof generatedIntegrations.bingSiteVerification === "string"
  ? generatedIntegrations.bingSiteVerification.trim()
  : "";
const bingVerification = bingFromEnv || bingFromGenerated || null;

export const integrations: IntegrationConfig = {
  analytics: /^G-[A-Z0-9]+$/i.test(gaMeasurementId)
    ? { provider: "google-analytics", measurementId: gaMeasurementId.toUpperCase() }
    : { provider: "none" },
  ads: {
    provider: "adsterra-native",
    scriptUrl: adsterraNative.scriptUrl,
    containerId: adsterraNative.containerId,
  },
  verification: {
    google: googleVerification,
    bing: bingVerification,
  },
};
