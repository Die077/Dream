import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { t } from "@/constants/translations";

const APPS = [
  { id: "org.telegram.messenger", name: "Telegram", icon: "send" },
  { id: "com.instagram.android", name: "Instagram", icon: "instagram" },
  { id: "com.google.android.youtube", name: "YouTube", icon: "youtube" },
  { id: "com.hbo.hbomax", name: "Max", icon: "tv" },
  { id: "com.imo.android.imoim", name: "IMO", icon: "video" },
  { id: "com.whatsapp", name: "WhatsApp", icon: "message-circle" },
  { id: "com.zhiliaoapp.musically", name: "TikTok", icon: "music" },
] as const;

const SITES = [
  { id: "instagram.com", name: "instagram.com" },
  { id: "youtube.com", name: "youtube.com" },
  { id: "t.me", name: "t.me (Telegram)" },
  { id: "tiktok.com", name: "tiktok.com" },
  { id: "facebook.com", name: "facebook.com" },
  { id: "twitter.com", name: "twitter.com / x.com" },
  { id: "uznews.net", name: "uznews.net" },
  { id: "currenttime.tv", name: "currenttime.tv" },
  { id: "kun.uz", name: "kun.uz" },
  { id: "daryo.uz", name: "daryo.uz" },
  { id: "gazeta.uz", name: "gazeta.uz" },
  { id: "bbc.com", name: "bbc.com" },
] as const;

type Tab = "apps" | "sites";

export default function SplitTunnelScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, splitTunnelApps, setSplitTunnelApp, splitTunnelSites, setSplitTunnelSite } = useApp();
  const [tab, setTab] = useState<Tab>("apps");

  const enabledApps = Object.values(splitTunnelApps).filter(Boolean).length;
  const enabledSites = Object.values(splitTunnelSites).filter(Boolean).length;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Platform.OS === "web" ? insets.top + 67 : insets.top + 16,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Pressable onPress={() => router.back()}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          {t[language].splitTunnel}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      {/* Info */}
      <View
        style={[
          styles.descCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Feather name="info" size={15} color={colors.primary} />
        <Text style={[styles.descText, { color: colors.mutedForeground }]}>
          {t[language].splitTunnelDesc}
        </Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { borderColor: colors.border }]}>
        <Pressable
          onPress={() => setTab("apps")}
          style={[
            styles.tab,
            tab === "apps" && { backgroundColor: colors.primary },
            { borderColor: colors.border },
          ]}
        >
          <Feather name="grid" size={14} color={tab === "apps" ? "#fff" : colors.mutedForeground} />
          <Text style={[styles.tabText, { color: tab === "apps" ? "#fff" : colors.mutedForeground }]}>
            Ilovalar ({enabledApps})
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setTab("sites")}
          style={[
            styles.tab,
            tab === "sites" && { backgroundColor: colors.primary },
            { borderColor: colors.border },
          ]}
        >
          <Feather name="globe" size={14} color={tab === "sites" ? "#fff" : colors.mutedForeground} />
          <Text style={[styles.tabText, { color: tab === "sites" ? "#fff" : colors.mutedForeground }]}>
            Saytlar ({enabledSites})
          </Text>
        </Pressable>
      </View>

      {/* List */}
      <ScrollView
        style={styles.list}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 100,
          gap: 6,
        }}
        showsVerticalScrollIndicator={false}
      >
        {tab === "apps"
          ? APPS.map((app) => (
              <View
                key={app.id}
                style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.iconBox, { backgroundColor: colors.secondary }]}>
                  <Feather name={app.icon as "send"} size={18} color={colors.primary} />
                </View>
                <Text style={[styles.rowName, { color: colors.foreground }]}>
                  {app.name}
                </Text>
                <Switch
                  value={splitTunnelApps[app.id] ?? false}
                  onValueChange={(val) => setSplitTunnelApp(app.id, val)}
                  trackColor={{ false: colors.border, true: colors.primary + "80" }}
                  thumbColor={splitTunnelApps[app.id] ? colors.primary : "#ccc"}
                />
              </View>
            ))
          : SITES.map((site) => (
              <View
                key={site.id}
                style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.iconBox, { backgroundColor: colors.secondary }]}>
                  <Feather name="globe" size={18} color={colors.primary} />
                </View>
                <Text style={[styles.rowName, { color: colors.foreground }]}>
                  {site.name}
                </Text>
                <Switch
                  value={splitTunnelSites[site.id] ?? false}
                  onValueChange={(val) => setSplitTunnelSite(site.id, val)}
                  trackColor={{ false: colors.border, true: colors.primary + "80" }}
                  thumbColor={splitTunnelSites[site.id] ? colors.primary : "#ccc"}
                />
              </View>
            ))}

        {tab === "apps" && (
          <View style={[styles.noteCard, { backgroundColor: "#F59E0B15", borderColor: "#F59E0B40" }]}>
            <Feather name="smartphone" size={14} color="#F59E0B" />
            <Text style={[styles.noteText, { color: "#F59E0B" }]}>
              To'liq ilova ro'yxati EAS build orqali qurilgan native APK da ko'rinadi
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: "Inter_600SemiBold",
  },
  descCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    margin: 16,
    marginBottom: 0,
  },
  descText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
  tabs: {
    flexDirection: "row",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
  list: { flex: 1 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  rowName: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  noteCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
  noteText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 17,
  },
});
