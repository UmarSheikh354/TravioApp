import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { TravioMark } from "@/components/TravioMark";
import { useApp } from "@/context/AppContext";

export default function SplashScreen() {
  const { user, loading } = useApp();
  const [logoScale] = useState(() => new Animated.Value(0.88));
  const [logoOpacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true
      })
    ]).start();
  }, [logoOpacity, logoScale]);

  useEffect(() => {
    if (loading) {
      return;
    }

    const timeout = setTimeout(() => {
      router.replace(user ? "/(tabs)" : "/onboarding");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [loading, user]);

  return (
    <LinearGradient colors={["#01020A", "#171466", "#3937D9"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={styles.container}>
      <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
        <TravioMark size={330} />
      </Animated.View>
      <Text style={styles.arrow}>↗</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 24
  },
  arrow: {
    bottom: 22,
    color: "#000",
    fontSize: 30,
    position: "absolute",
    right: 28,
    transform: [{ rotate: "-35deg" }]
  }
});
