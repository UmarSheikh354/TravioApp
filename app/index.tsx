import { router } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Logo } from "@/components/Logo";
import { useApp } from "@/context/AppContext";
import { colors } from "@/lib/theme";

export default function SplashScreen() {
  const { user, initializing } = useApp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (initializing) {
        return;
      }
      router.replace(user ? "/(tabs)" : "/onboarding");
    }, 2000);
    return () => clearTimeout(timer);
  }, [user, initializing]);

  return (
    <View style={styles.container}>
      <View style={styles.glow} />
      <Animated.View entering={FadeIn.duration(600)} style={styles.content}>
        <Logo size={80} />
        <Text style={styles.title}>TRAVIO</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  title: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 4,
  },
});
