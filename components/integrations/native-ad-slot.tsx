import { integrations } from "@/config/integrations";
import { NativeAdClient } from "./native-ad-client";

export function NativeAdSlot() {
  if (integrations.ads.provider !== "adsterra-native") return null;

  return (
    <div className="ad-native-slot">
      <p className="ad-label">Sponsored</p>
      <NativeAdClient
        scriptUrl={integrations.ads.scriptUrl}
        containerId={integrations.ads.containerId}
      />
    </div>
  );
}
