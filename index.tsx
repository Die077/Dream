import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { VpnButton } from "@/components/VpnButton";
import { useApp } from "@/context/AppContext";
import { t } from "@/constants/translations";

const BOT_USERNAME = "ruspn_bot";

// Static star positions for space background
const STARS = [
  { left: "8%", top: "4%", size: 2.5 },
  { left: "22%", top: "11%", size: 1.5 },
  { left: "45%", top: "3%", size: 2 },
  { left: "67%", top: "7%", size: 1.5 },
  { left: "82%", top: "13%", size: 2.5 },
  { left: "91%", top: "5%", size: 1 },
  { left: "5%", top: "22%", size: 1.5 },
  { left: "15%", top: "35%", size: 1 },
  { left: "88%", top: "28%", size: 2 },
  { left: "94%", top: "42%", size: 1.5 },
  { left: "3%", top: "55%", size: 2 },
  { left: "12%", top: "68%", size: 1 },
  { left: "86%", top: "61%", size: 1.5 },
  { left: "92%", top: "74%", size: 2 },
  { left: "7%", top: "80%", size: 1.5 },
  { left: "25%", top: "88%", size: 1 },
  { left: "75%", top: "85%", size: 2 },
  { left: "55%", top: "92%", size: 1.5 },
  { left: "38%", top: "18%", size: 1 },
  { left: "72%", top: "22%", size: 1 },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {
    language,
    vpnStatus,
    setVpnStatus,
    vlessConfig,
    subscription,
    startTrial,
    isSubscribed,
    trialDaysLeft,
  } = useApp();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;

  // Upload/download speed (fake animation when connected)
  const [dl, setDl] = useState("0.0");
  const [ul, setUl] = useState("0.0");

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(titleAnim, {
          toValue: 1, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: false,
        }),
        Animated.timing(titleAnim, {
          toValue: 0, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: false,
        }),
      ]),
    ).start();
  }, []);

  useEffect(() => {
    if (!subscription.trialStartedAt && !subscription.code) {
      startTrial();
    }
  }, []);

  // Fake speed animation when connected
  useEffect(() => {
    if (vpnStatus !== "connected") {
      setDl("0.0");
      setUl("0.0");
      return;
    }
    const interval = setInterval(() => {
      const d = (55 + Math.random() * 20).toFixed(1);
      const u = (18 + Math.random() * 8).toFixed(1);
      setDl(d);
      setUl(u);
    }, 1200);
    return () => clearInterval(interval);
  }, [vpnStatus]);

  const titleColor = titleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ["#4FACFE", "#00F2FE", "#a0d8ef"],
  });

  const handleVpnToggle = () => {
    if (!isSubscribed) {
      router.push("/enter-code");
      return;
    }
    if (!vlessConfig) {
      Alert.alert("", t[language].noConfig);
      return;
    }
    if (vpnStatus === "disconnected") {
      setVpnStatus("connecting");
      setTimeout(() => setVpnStatus("connected"), 1800);
    } else {
      setVpnStatus("disconnected");
    }
  };

  const handleOpenBot = () => {
    Linking.openURL(`https://t.me/${BOT_USERNAME}`);
  };

  const handleCopyConfig = async () => {
    if (!vlessConfig) {
      Alert.alert("", t[language].noConfigToCopy);
      return;
    }
    await Clipboard.setStringAsync(vlessConfig);
    Alert.alert("", t[language].copied);
  };

  const statusColor =
    vpnStatus === "connected"
      ? "#00E676"
      : vpnStatus === "connecting"
      ? "#F59E0B"
      : "#6B7280";

  const vpnLabel =
    vpnStatus === "connected"
      ? t[language].disconnect
      : vpnStatus === "connecting"
      ? t[language].connecting
      : t[language].connect;

  const statusText =
    vpnStatus === "connected"
      ? t[language].connected
      : vpnStatus === "connecting"
      ? t[language].connecting
      : t[language].disconnected;

  const showExpiredBanner =
    subscription.trialStartedAt !== null && !isSubscribed && !subscription.isTrial;
  const showTrial = isSubscribed && subscription.isTrial && trialDaysLeft > 0;

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
      {/* Space background */}
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.bgBase} />
        {/* Stars */}
        {STARS.map((s, i) => (
          <View
            key={i}
            style={[
              styles.star,
              {
                left: s.left as any,
                top: s.top as any,
                width: s.size,
                height: s.size,
                borderRadius: s.size / 2,
              },
            ]}
          />
        ))}
        {/* Planet decorations */}
        <View style={styles.planet1} />
        <View style={styles.planet1Inner} />
        <View style={styles.planet2} />
        <View style={styles.planet2Inner} />
      </View>

      <View
        style={[
          styles.content,
          {
            paddingTop: Platform.OS === "web" ? insets.top + 67 : insets.top + 20,
            paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 90,
          },
        ]}
      >
        {/* ── Top bar ── */}
        <View style={styles.topBar}>
          <Animated.Text style={[styles.appName, { color: titleColor }]}>
            WPN
          </Animated.Text>
          <Pressable onPress={handleOpenBot} style={styles.botChip}>
            <Feather name="send" size={13} color="#4FACFE" />
            <Text style={styles.botChipText}>@{BOT_USERNAME}</Text>
          </Pressable>
        </View>

        {/* ── Server label ── */}
        <View style={styles.serverRow}>
          <Text style={styles.serverFlag}>🇩🇪</Text>
          <Text style={styles.serverName}>Germany — VLESS+Reality</Text>
        </View>

        {/* ── Trial / Expired banners ── */}
        {showTrial && (
          <View style={styles.trialBanner}>
            <Feather name="clock" size={13} color="#F59E0B" />
            <Text style={styles.trialText}>
              Sinov: {trialDaysLeft} kun qoldi
            </Text>
          </View>
        )}
        {showExpiredBanner && (
          <Pressable onPress={() => router.push("/enter-code")} style={styles.expiredBanner}>
            <Feather name="alert-circle" size={13} color="#EF4444" />
            <Text style={styles.expiredText}>Obuna tugadi — Yangilash</Text>
            <Feather name="chevron-right" size={13} color="#EF4444" />
          </Pressable>
        )}

        {/* ── VPN Button ── */}
        <View style={styles.btnArea}>
          <VpnButton
            status={vpnStatus}
            onPress={handleVpnToggle}
            label={vpnLabel}
            disabled={vpnStatus === "connecting"}
          />
        </View>

        {/* ── Status ── */}
        <View style={styles.statusRow}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {statusText}
          </Text>
        </View>

        {/* ── Speed stats (only when connected) ── */}
        {vpnStatus === "connected" && (
          <View style={styles.speedRow}>
            <View style={styles.speedItem}>
              <Feather name="arrow-down" size={14} color="#00C8FF" />
              <View>
                <Text style={styles.speedVal}>{dl} KB/s</Text>
                <Text style={styles.speedLabel}>Yuklab olish</Text>
              </View>
            </View>
            <View style={styles.speedDivider} />
            <View style={styles.speedItem}>
              <Feather name="arrow-up" size={14} color="#00E676" />
              <View>
                <Text style={styles.speedVal}>{ul} KB/s</Text>
                <Text style={styles.speedLabel}>Yuklash</Text>
              </View>
            </View>
          </View>
        )}

        {/* ── Actions ── */}
        <View style={styles.actions}>
          <Pressable onPress={() => router.push("/enter-code")} style={styles.actionBtn}>
            <Feather name="key" size={16} color="#4FACFE" />
            <Text style={styles.actionText}>{t[language].subscriptionCode}</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/split-tunnel")} style={styles.actionBtn}>
            <Feather name="git-branch" size={16} color="#4FACFE" />
            <Text style={styles.actionText}>{t[language].splitTunnel}</Text>
          </Pressable>
        </View>

        {/* ── Telegram bot card ── */}
        <Pressable onPress={handleOpenBot} style={styles.botCard}>
          <View style={styles.botCardLeft}>
            <View style={styles.botIconWrap}>
              <Feather name="send" size={18} color="#4FACFE" />
            </View>
            <View>
              <View style={styles.botCardTitleRow}>
                <Text style={styles.botCardTitle}>Telegram Bot</Text>
                <View style={styles.newBadge}>
                  <Text style={styles.newBadgeText}>Yangi</Text>
                </View>
              </View>
              <Text style={styles.botCardSub}>Obuna sotib olish · @{BOT_USERNAME}</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={18} color="#4FACFE" />
        </Pressable>

        {/* Config copy button */}
        {vlessConfig ? (
          <Pressable onPress={handleCopyConfig} style={styles.copyBtn}>
            <Feather name="copy" size={14} color="#9CA3AF" />
            <Text style={styles.copyBtnText}>{t[language].copyConfig}</Text>
          </Pressable>
        ) : null}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  bgBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#080C1A",
  },
  star: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  planet1: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#C0392B",
    top: "10%",
    right: -20,
    shadowColor: "#E74C3C",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  planet1Inner: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E74C3C",
    top: "11.5%",
    right: -5,
  },
  planet2: {
    position: "absolute",
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: "#4B0082",
    bottom: "22%",
    left: -12,
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 8,
  },
  planet2Inner: {
    position: "absolute",
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#7C3AED",
    bottom: "23.5%",
    left: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 14,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  appName: {
    fontSize: 34,
    fontFamily: "Inter_700Bold",
    letterSpacing: 4,
  },
  botChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(79,172,254,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(79,172,254,0.25)",
  },
  botChipText: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: "#4FACFE",
  },
  serverRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  serverFlag: {
    fontSize: 18,
  },
  serverName: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.55)",
  },
  trialBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(245,158,11,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.3)",
  },
  trialText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#F59E0B",
  },
  expiredBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(239,68,68,0.12)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.3)",
  },
  expiredText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "#EF4444",
    flex: 1,
  },
  btnArea: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 0.3,
  },
  speedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  speedItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  speedDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  speedVal: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  speedLabel: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.4)",
    marginTop: 1,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  actionText: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    color: "rgba(255,255,255,0.7)",
  },
  botCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "rgba(79,172,254,0.08)",
    borderWidth: 1,
    borderColor: "rgba(79,172,254,0.22)",
    borderRadius: 16,
    padding: 14,
  },
  botCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  botIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(79,172,254,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  botCardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  botCardTitle: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  newBadge: {
    backgroundColor: "#4FACFE",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  newBadgeText: {
    fontSize: 9,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  botCardSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.45)",
    marginTop: 2,
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  copyBtnText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.35)",
  },
});
