import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { Language } from "@/constants/translations";

export type VpnStatus = "disconnected" | "connecting" | "connected";

export interface SubscriptionState {
  isActive: boolean;
  expiresAt: number | null;
  code: string | null;
  isTrial: boolean;
  trialStartedAt: number | null;
}

interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;

  vpnStatus: VpnStatus;
  setVpnStatus: (status: VpnStatus) => void;

  vlessConfig: string;
  setVlessConfig: (config: string) => void;

  subscription: SubscriptionState;
  activateCode: (code: string) => Promise<boolean>;
  startTrial: () => Promise<void>;

  splitTunnelApps: Record<string, boolean>;
  setSplitTunnelApp: (pkg: string, enabled: boolean) => void;

  splitTunnelSites: Record<string, boolean>;
  setSplitTunnelSite: (site: string, enabled: boolean) => void;

  trialDaysLeft: number;
  isSubscribed: boolean;
}

const KEYS = {
  language: "@vpn/language",
  vlessConfig: "@vpn/vless_config",
  subscription: "@vpn/subscription",
  splitTunnel: "@vpn/split_tunnel",
  splitTunnelSites: "@vpn/split_tunnel_sites",
} as const;

const TRIAL_DURATION_MS = 3 * 24 * 60 * 60 * 1000;
const SUB_DURATION_MS = 30 * 24 * 60 * 60 * 1000;
const VALID_CODE_REGEX = /^[A-Z0-9]{12}$/i;

// Only the 7 apps the user needs
const ALL_APPS_DEFAULT: Record<string, boolean> = {
  "org.telegram.messenger": true,
  "com.instagram.android": true,
  "com.google.android.youtube": true,
  "com.hbo.hbomax": true,
  "com.imo.android.imoim": true,
  "com.whatsapp": true,
  "com.zhiliaoapp.musically": true,
};

// Uzbekistan-blocked or restricted websites
const ALL_SITES_DEFAULT: Record<string, boolean> = {
  "instagram.com": true,
  "youtube.com": true,
  "t.me": true,
  "tiktok.com": true,
  "facebook.com": true,
  "twitter.com": true,
  "x.com": true,
  "kun.uz": false,
  "daryo.uz": false,
  "gazeta.uz": false,
  "uznews.net": true,
  "currenttime.tv": true,
  "bbc.com": false,
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("uz");
  const [vpnStatus, setVpnStatus] = useState<VpnStatus>("disconnected");
  const [vlessConfig, setVlessConfigState] = useState("");
  const [subscription, setSubscription] = useState<SubscriptionState>({
    isActive: false,
    expiresAt: null,
    code: null,
    isTrial: false,
    trialStartedAt: null,
  });
  const [splitTunnelApps, setSplitTunnelApps] = useState<Record<string, boolean>>(ALL_APPS_DEFAULT);
  const [splitTunnelSites, setSplitTunnelSites] = useState<Record<string, boolean>>(ALL_SITES_DEFAULT);

  useEffect(() => {
    (async () => {
      try {
        const [lang, config, sub, split, sites] = await Promise.all([
          AsyncStorage.getItem(KEYS.language),
          AsyncStorage.getItem(KEYS.vlessConfig),
          AsyncStorage.getItem(KEYS.subscription),
          AsyncStorage.getItem(KEYS.splitTunnel),
          AsyncStorage.getItem(KEYS.splitTunnelSites),
        ]);
        if (lang) setLanguageState(lang as Language);
        if (config) setVlessConfigState(config);
        if (sub) setSubscription(JSON.parse(sub));
        if (split) setSplitTunnelApps(JSON.parse(split));
        if (sites) setSplitTunnelSites(JSON.parse(sites));
      } catch {
        // ignore
      }
    })();
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem(KEYS.language, lang);
  }, []);

  const setVlessConfig = useCallback(async (config: string) => {
    setVlessConfigState(config);
    await AsyncStorage.setItem(KEYS.vlessConfig, config);
  }, []);

  const saveSubscription = useCallback(async (sub: SubscriptionState) => {
    setSubscription(sub);
    await AsyncStorage.setItem(KEYS.subscription, JSON.stringify(sub));
  }, []);

  const startTrial = useCallback(async () => {
    if (subscription.trialStartedAt) return;
    const now = Date.now();
    const sub: SubscriptionState = {
      isActive: true,
      expiresAt: now + TRIAL_DURATION_MS,
      code: null,
      isTrial: true,
      trialStartedAt: now,
    };
    await saveSubscription(sub);
  }, [subscription.trialStartedAt, saveSubscription]);

  const activateCode = useCallback(
    async (code: string): Promise<boolean> => {
      const trimmed = code.trim().toUpperCase();
      if (!VALID_CODE_REGEX.test(trimmed)) return false;
      const now = Date.now();
      const sub: SubscriptionState = {
        isActive: true,
        expiresAt: now + SUB_DURATION_MS,
        code: trimmed,
        isTrial: false,
        trialStartedAt: subscription.trialStartedAt,
      };
      await saveSubscription(sub);
      return true;
    },
    [subscription.trialStartedAt, saveSubscription],
  );

  const setSplitTunnelApp = useCallback(
    async (pkg: string, enabled: boolean) => {
      const updated = { ...splitTunnelApps, [pkg]: enabled };
      setSplitTunnelApps(updated);
      await AsyncStorage.setItem(KEYS.splitTunnel, JSON.stringify(updated));
    },
    [splitTunnelApps],
  );

  const setSplitTunnelSite = useCallback(
    async (site: string, enabled: boolean) => {
      const updated = { ...splitTunnelSites, [site]: enabled };
      setSplitTunnelSites(updated);
      await AsyncStorage.setItem(KEYS.splitTunnelSites, JSON.stringify(updated));
    },
    [splitTunnelSites],
  );

  const isSubscribed =
    subscription.isActive &&
    subscription.expiresAt !== null &&
    subscription.expiresAt > Date.now();

  const trialDaysLeft = (() => {
    if (!subscription.isTrial || !subscription.expiresAt) return 0;
    const diff = subscription.expiresAt - Date.now();
    return Math.max(0, Math.ceil(diff / (24 * 60 * 60 * 1000)));
  })();

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        vpnStatus,
        setVpnStatus,
        vlessConfig,
        setVlessConfig,
        subscription,
        activateCode,
        startTrial,
        splitTunnelApps,
        setSplitTunnelApp,
        splitTunnelSites,
        setSplitTunnelSite,
        trialDaysLeft,
        isSubscribed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
