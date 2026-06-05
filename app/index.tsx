import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useApp } from "@/context/AppContext";

export default function SplashScreen() {
  const { t } = useTranslation();
  const { user, loading } = useApp();

  useEffect(() => {
    if (loading) {
      return;
    }

    const timeout = setTimeout(() => {
      router.replace(user ? "/(tabs)" : "/onboarding");
    }, 900);

    return () => clearTimeout(timeout);
  }, [loading, user]);

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>{t("appName")}</Text>
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
