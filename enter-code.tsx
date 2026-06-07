import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { t } from "@/constants/translations";

// ─── REPLACE with your actual bot username ───────────────────────────────────
const BOT_USERNAME = "ruspn_bot";
// ─────────────────────────────────────────────────────────────────────────────

export default function EnterCodeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, activateCode } = useApp();

  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  const handleSubmit = async () => {
    if (!code.trim()) return;
    setStatus("loading");
    const ok = await activateCode(code);
    if (ok) {
      setStatus("success");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTimeout(() => router.back(), 1500);
    } else {
      setStatus("error");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      shake();
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  const handleOpenBot = () => {
    Linking.openURL(`https://t.me/${BOT_USERNAME}`);
  };

  const borderColor =
    status === "success"
      ? "#22C55E"
      : status === "error"
        ? "#EF4444"
        : colors.border;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + 20,
            paddingBottom: insets.bottom + 20,
          },
        ]}
      >
        {/* Back */}
        <Pressable onPress={() => router.back()} style={styles.back}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>

        {/* Icon */}
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: colors.primary + "20" },
          ]}
        >
          <Feather name="key" size={36} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>
          {t[language].subscriptionCode}
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {t[language].paymentInstructions}
        </Text>

        {/* Code Input */}
        <Animated.View
          style={[
            styles.inputWrap,
            {
              backgroundColor: colors.card,
              borderColor,
              transform: [{ translateX: shakeAnim }],
            },
          ]}
        >
          <TextInput
            value={code}
            onChangeText={(v) => {
              setCode(v.toUpperCase());
              setStatus("idle");
            }}
            placeholder="XXXXXXXXXXXX"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground }]}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={12}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
          {status === "success" && (
            <Feather name="check-circle" size={20} color="#22C55E" />
          )}
          {status === "error" && (
            <Feather name="x-circle" size={20} color="#EF4444" />
          )}
        </Animated.View>

        {/* Status message */}
        {status === "success" && (
          <Text style={[styles.statusMsg, { color: "#22C55E" }]}>
            {t[language].validCode}
          </Text>
        )}
        {status === "error" && (
          <Text style={[styles.statusMsg, { color: "#EF4444" }]}>
            {t[language].invalidCode}
          </Text>
        )}

        {/* Submit */}
        <Pressable
          onPress={handleSubmit}
          disabled={status === "loading" || code.length < 8}
          style={[
            styles.submitBtn,
            {
              backgroundColor:
                code.length >= 8 ? colors.primary : colors.muted,
              opacity: code.length >= 8 ? 1 : 0.6,
            },
          ]}
        >
          {status === "loading" ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitText}>{t[language].validateCode}</Text>
          )}
        </Pressable>

        {/* Get code via bot */}
        <View style={styles.divider}>
          <View style={[styles.divLine, { backgroundColor: colors.border }]} />
          <Text style={[styles.divText, { color: colors.mutedForeground }]}>
            or
          </Text>
          <View style={[styles.divLine, { backgroundColor: colors.border }]} />
        </View>

        <Pressable
          onPress={handleOpenBot}
          style={[
            styles.botBtn,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Feather name="send" size={18} color={colors.primary} />
          <Text style={[styles.botBtnText, { color: colors.primary }]}>
            {t[language].subscribeNow} @{BOT_USERNAME}
          </Text>
          <Feather name="external-link" size={14} color={colors.mutedForeground} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 16,
  },
  back: {
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 8,
  },
  input: {
    flex: 1,
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: 4,
    textAlign: "center",
    paddingVertical: 14,
  },
  statusMsg: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    marginTop: -8,
  },
  submitBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    gap: 10,
    marginVertical: 4,
  },
  divLine: { flex: 1, height: 1 },
  divText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  botBtn: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  botBtnText: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
});
