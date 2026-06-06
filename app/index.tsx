import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { TravioMark } from "@/components/TravioMark";
import { useApp } from "@/context/AppContext";
import { colors } from "@/lib/theme";

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
    <View style={styles.container}>
      <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
        <TravioMark size={58} showWordmark />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: "center",
    padding: 24
  }
});
