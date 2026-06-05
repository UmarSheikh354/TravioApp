import { router } from "expo-router";
import { useEffect, useRef } from "react";
import { ActivityIndicator, Animated, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useApp } from "@/context/AppContext";

export default function SplashScreen() {
  const { t } = useTranslation();
  const { user, loading } = useApp();
  const logoScale = useRef(new Animated.Value(0.88)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

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
      <Animated.Text style={[styles.logo, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
        {t("appName")}
      </Animated.Text>
      <Text style={styles.tagline}>{t("splashTagline")}</Text>
      <ActivityIndicator color="#21d4a2" size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#05070d",
    flex: 1,
    gap: 16,
    justifyContent: "center",
    padding: 24
  },
  logo: {
    color: "#fff",
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 1
  },
  tagline: {
    color: "#9aa7bd",
    fontSize: 16,
    marginBottom: 20
  }
});
