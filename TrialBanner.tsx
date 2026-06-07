import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { Language, t } from "@/constants/translations";

interface TrialBannerProps {
  daysLeft: number;
  language: Language;
}

export function TrialBanner({ daysLeft, language }: TrialBannerProps) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: "#F59E0B15", borderColor: "#F59E0B40" },
      ]}
    >
      <Feather name="clock" size={16} color="#F59E0B" />
      <Text style={styles.text}>
        <Text style={{ color: "#F59E0B", fontFamily: "Inter_600SemiBold" }}>
          {t[language].trialBanner}
        </Text>
        <Text style={{ color: colors.foreground }}>
          {daysLeft} {t[language].trialDaysLeft}
        </Text>
      </Text>
      <Pressable
        onPress={() => router.push("/enter-code")}
        style={[styles.button, { backgroundColor: "#F59E0B" }]}
      >
        <Text style={styles.buttonText}>{t[language].enterCode}</Text>
      </Pressable>
    </View>
  );
}

export function ExpiredBanner({ language }: { language: Language }) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: "#EF444415", borderColor: "#EF444440" },
      ]}
    >
      <Feather name="alert-circle" size={16} color="#EF4444" />
      <Text style={[styles.text, { color: colors.foreground, flex: 1 }]}>
        {t[language].subscribeBanner}
      </Text>
      <Pressable
        onPress={() => router.push("/enter-code")}
        style={[styles.button, { backgroundColor: "#EF4444" }]}
      >
        <Text style={styles.buttonText}>{t[language].subscribeNow}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  text: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
});
