import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";

import { VpnStatus } from "@/context/AppContext";

interface VpnButtonProps {
  status: VpnStatus;
  onPress: () => void;
  label: string;
  disabled?: boolean;
}

export function VpnButton({ status, onPress, label, disabled }: VpnButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const ring1Opacity = useRef(new Animated.Value(0.15)).current;
  const ring2Opacity = useRef(new Animated.Value(0.3)).current;
  const ring1Scale = useRef(new Animated.Value(1)).current;
  const ring2Scale = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  const connectedColor = "#00E676";
  const disconnectedColor = "#00C8FF";
  const connectingColor = "#F59E0B";

  const getColor = () => {
    if (status === "connected") return connectedColor;
    if (status === "connecting") return connectingColor;
    return disconnectedColor;
  };

  const currentColor = getColor();

  useEffect(() => {
    const dur = status === "connecting" ? 700 : status === "connected" ? 1400 : 2200;
    const maxScale = status === "connecting" ? 1.15 : 1.08;

    const scaleLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: maxScale,
          duration: dur,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: dur,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const ring1Loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ring1Opacity, {
            toValue: status === "connected" ? 0.55 : 0.35,
            duration: dur * 1.2,
            useNativeDriver: true,
          }),
          Animated.timing(ring1Scale, {
            toValue: 1.12,
            duration: dur * 1.2,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ring1Opacity, {
            toValue: 0.05,
            duration: dur * 1.2,
            useNativeDriver: true,
          }),
          Animated.timing(ring1Scale, {
            toValue: 1,
            duration: dur * 1.2,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    const ring2Loop = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ring2Opacity, {
            toValue: status === "connected" ? 0.35 : 0.2,
            duration: dur * 1.8,
            useNativeDriver: true,
          }),
          Animated.timing(ring2Scale, {
            toValue: 1.22,
            duration: dur * 1.8,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ring2Opacity, {
            toValue: 0.02,
            duration: dur * 1.8,
            useNativeDriver: true,
          }),
          Animated.timing(ring2Scale, {
            toValue: 1,
            duration: dur * 1.8,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );

    scaleLoop.start();
    ring1Loop.start();
    ring2Loop.start();
    return () => {
      scaleLoop.stop();
      ring1Loop.stop();
      ring2Loop.stop();
    };
  }, [status]);

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Pressable onPress={handlePress} disabled={disabled} style={styles.pressable}>
      {/* Outermost pulse ring */}
      <Animated.View
        style={[
          styles.ring2,
          {
            backgroundColor: currentColor,
            opacity: ring2Opacity,
            transform: [{ scale: ring2Scale }],
          },
        ]}
      />

      {/* Inner pulse ring */}
      <Animated.View
        style={[
          styles.ring1,
          {
            backgroundColor: currentColor,
            opacity: ring1Opacity,
            transform: [{ scale: ring1Scale }],
          },
        ]}
      />

      {/* Circle border ring */}
      <View
        style={[
          styles.borderRing,
          {
            borderColor: currentColor + "60",
          },
        ]}
      >
        {/* Button body */}
        <Animated.View
          style={[
            styles.button,
            {
              backgroundColor: currentColor + "22",
              borderColor: currentColor + "99",
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Feather
            name="power"
            size={52}
            color={currentColor}
          />
          <Text style={[styles.btnLabel, { color: currentColor }]}>
            {label}
          </Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignItems: "center",
    justifyContent: "center",
    width: 280,
    height: 280,
  },
  ring2: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  ring1: {
    position: "absolute",
    width: 230,
    height: 230,
    borderRadius: 115,
  },
  borderRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  btnLabel: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});
