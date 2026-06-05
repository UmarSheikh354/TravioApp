import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { useApp } from "@/context/AppContext";

export default function EmailVerificationScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ email?: string }>();
  const { verifyEmail } = useApp();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const email = params.email ?? "";

  async function handleVerify() {
    try {
      setLoading(true);
      await verifyEmail(email, token || "000000");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(t("verification"), error instanceof Error ? error.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen style={styles.screen}>
      <Text style={styles.title}>{t("verification")}</Text>
      <Text style={styles.subtitle}>{t("verificationHint")}</Text>
      <Text style={styles.email}>{email}</Text>
      <TextField
        label="Code"
        keyboardType="number-pad"
        placeholder="000000"
        value={token}
        onChangeText={setToken}
      />
      <PrimaryButton title={t("verify")} loading={loading} onPress={handleVerify} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center"
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900"
  },
  subtitle: {
    color: "#9aa7bd",
    fontSize: 16,
    lineHeight: 24
  },
  email: {
    color: "#21d4a2",
    fontWeight: "700"
  }
});
