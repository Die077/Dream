import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { Language, LANGUAGES, t } from "@/constants/translations";

// ─── REPLACE with your actual bot username ───────────────────────────────────
const BOT_USERNAME = "ruspn_bot";
// ─────────────────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, setLanguage, vlessConfig, setVlessConfig, subscription, isSubscribed, trialDaysLeft } =
    useApp();

  const [configInput, setConfigInput] = useState(vlessConfig);
  const [saved, setSaved] = useState(false);

  const handleSaveConfig = async () => {
    await setVlessConfig(configInput.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasteConfig = async () => {
    const text = await Clipboard.getStringAsync();
    if (text) setConfigInput(text);
  };

  const handleOpenBot = () => {
    Linking.openURL(`https://t.me/${BOT_USERNAME}`);
  };

  const subStatusText = () => {
    if (!subscription.trialStartedAt && !subscription.code) return t[language].freeTrial;
    if (isSubscribed && subscription.isTrial)
      return `${t[language].freeTrial} — ${trialDaysLeft} ${t[language].daysRemaining}`;
    if (isSubscribed && !subscription.isTrial)
      return `${t[language].subscriptionCode} — ${
        subscription.expiresAt
          ? Math.max(
              0,
              Math.ceil((subscription.expiresAt - Date.now()) / (24 * 60 * 60 * 1000)),
            )
          : 0
      } ${t[language].daysRemaining}`;
    return t[language].trialExpired;
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={[
        styles.scroll,
        {
          paddingTop: Platform.OS === "web" ? insets.top + 67 : insets.top + 16,
          paddingBottom: Platform.OS === "web" ? 34 + 84 : insets.bottom + 100,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Subscription Status ── */}
      <SectionHeader title={t[language].subscriptionCode} colors={colors} />
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.row}>
          <Feather
            name="shield"
            size={18}
            color={isSubscribed ? "#22C55E" : colors.mutedForeground}
          />
          <Text style={[styles.rowText, { color: colors.foreground }]}>
            {subStatusText()}
          </Text>
        </View>
      </View>

      {/* ── VLESS Config ── */}
      <SectionHeader title={t[language].vlessConfig} colors={colors} />
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.inputRow}>
          <TextInput
            value={configInput}
            onChangeText={setConfigInput}
            placeholder={t[language].pasteConfig}
            placeholderTextColor={colors.mutedForeground}
            style={[
              styles.input,
              { color: colors.foreground, borderColor: colors.border },
            ]}
            multiline
            numberOfLines={3}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={styles.configActions}>
          <Pressable
            onPress={handlePasteConfig}
            style={[styles.configBtn, { backgroundColor: colors.secondary }]}
          >
            <Feather name="clipboard" size={14} color={colors.foreground} />
            <Text style={[styles.configBtnText, { color: colors.foreground }]}>
              Paste
            </Text>
          </Pressable>
          <Pressable
            onPress={handleSaveConfig}
            style={[styles.configBtn, { backgroundColor: colors.primary }]}
          >
            <Feather name="save" size={14} color="#fff" />
            <Text style={[styles.configBtnText, { color: "#fff" }]}>
              {saved ? t[language].configSaved : t[language].saveConfig}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ── Language ── */}
      <SectionHeader title={t[language].language} colors={colors} />
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {(Object.keys(LANGUAGES) as Language[]).map((lang, i, arr) => (
          <Pressable
            key={lang}
            onPress={() => setLanguage(lang)}
            style={[
              styles.row,
              i < arr.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.rowText, { color: colors.foreground, flex: 1 }]}>
              {LANGUAGES[lang]}
            </Text>
            {language === lang && (
              <Feather name="check" size={16} color={colors.primary} />
            )}
          </Pressable>
        ))}
      </View>

      {/* ── Telegram Bot ── */}
      <SectionHeader title={t[language].botLink} colors={colors} />
      <Pressable
        onPress={handleOpenBot}
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <View style={styles.row}>
          <Feather name="send" size={18} color={colors.primary} />
          <Text style={[styles.rowText, { color: colors.primary, flex: 1 }]}>
            @{BOT_USERNAME}
          </Text>
          <Feather name="external-link" size={14} color={colors.mutedForeground} />
        </View>
        <Text style={[styles.subText, { color: colors.mutedForeground }]}>
          {t[language].paymentInstructions}
        </Text>
      </Pressable>

      {/* ── About ── */}
      <SectionHeader title={t[language].aboutApp} colors={colors} />
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.row}>
          <Text style={[styles.rowText, { color: colors.mutedForeground }]}>
            {t[language].version}
          </Text>
          <Text style={[styles.rowText, { color: colors.foreground }]}>1.0.0</Text>
        </View>
        <View style={[styles.row, { borderTopWidth: 1, borderTopColor: colors.border }]}>
          <Text style={[styles.rowText, { color: colors.mutedForeground, flex: 1 }]}>
            VLESS + Reality
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function SectionHeader({
  title,
  colors,
}: {
  title: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <Text
      style={[
        styles.sectionHeader,
        { color: colors.mutedForeground },
      ]}
    >
      {title.toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
  },
  subText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  inputRow: {
    padding: 12,
  },
  input: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    minHeight: 72,
    textAlignVertical: "top",
  },
  configActions: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    paddingTop: 0,
  },
  configBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  configBtnText: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
  },
});
