import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { useApp } from "@/context/AppContext";

export default function LoginScreen() {
  const { t } = useTranslation();
  const { signInWithEmail, signInWithApple, signInWithGoogle } = useApp();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<"email" | "apple" | "google" | null>(null);

  async function handleEmail() {
    try {
      setLoading("email");
      await signInWithEmail(email);
      router.push({ pathname: "/email-verification", params: { email } });
    } catch (error) {
      Alert.alert(t("login"), error instanceof Error ? error.message : "Email login failed.");
    } finally {
      setLoading(null);
    }
  }

  async function handleSocial(provider: "apple" | "google") {
    try {
      setLoading(provider);
      if (provider === "apple") {
        await signInWithApple();
      } else {
        await signInWithGoogle();
      }
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(t("login"), error instanceof Error ? error.message : "Social login failed.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <Screen style={styles.screen}>
      <Text style={styles.title}>{t("login")}</Text>
      <Text style={styles.subtitle}>Access Travio to search, pay, and track orders.</Text>
      <PrimaryButton
        title={t("continueWithApple")}
        variant="secondary"
        loading={loading === "apple"}
        onPress={() => handleSocial("apple")}
      />
      <PrimaryButton
        title={t("continueWithGoogle")}
        variant="secondary"
        loading={loading === "google"}
        onPress={() => handleSocial("google")}
      />
      <TextField
        label={t("email")}
        keyboardType="email-address"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
      />
      <PrimaryButton
        title={t("continueWithEmail")}
        loading={loading === "email"}
        disabled={!email.includes("@")}
        onPress={handleEmail}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center"
  },
  title: {
    color: "#fff",
    fontSize: 34,
    fontWeight: "900"
  },
  subtitle: {
    color: "#9aa7bd",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16
  }
});
