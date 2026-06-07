import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";
import { VpnStatus } from "@/context/AppContext";

interface StatusCardProps {
  status: VpnStatus;
  statusLabel: string;
  serverLabel?: string;
}

export function StatusCard({ status, statusLabel, serverLabel }: StatusCardProps) {
  const colors = useColors();

  const statusColor =
    status === "connected"
      ? "#22C55E"
      : status === "connecting"
        ? "#F59E0B"
        : colors.mutedForeground;

  const iconName =
    status === "connected"
      ? "shield"
      : status === "connecting"
        ? "loader"
        : "shield-off";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: statusColor + "30",
        },
      ]}
    >
      <View style={[styles.indicator, { backgroundColor: statusColor + "20" }]}>
        <Feather name={iconName} size={20} color={statusColor} />
      </View>
      <View style={styles.text}>
        <Text style={[styles.statusText, { color: statusColor }]}>
          {statusLabel}
        </Text>
        {serverLabel ? (
          <Text style={[styles.serverText, { color: colors.mutedForeground }]}>
            {serverLabel}
          </Text>
        ) : null}
      </View>
      <View style={[styles.dot, { backgroundColor: statusColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
  },
  indicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    flex: 1,
  },
  statusText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  serverText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
