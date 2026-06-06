import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { TravioHeader } from "@/components/TravioMark";
import { useApp } from "@/context/AppContext";
import { colors } from "@/lib/theme";

export default function EmailVerificationScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ email?: string; agreementAcceptedAt?: string }>();
  const { verifyEmail } = useApp();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const email = params.email ?? "";

  async function handleVerify() {
    try {
      setLoading(true);
      await verifyEmail(email, token || "000000", params.agreementAcceptedAt ?? new Date().toISOString());
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(t("verification"), error instanceof Error ? error.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen style={styles.screen}>
      <TravioHeader />
      <View style={styles.center}>
        <Text style={styles.icon}>✉</Text>
        <Text style={styles.title}>{t("verification")}</Text>
        <Text style={styles.subtitle}>{t("verificationHint")}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
      <View style={styles.controls}>
        <TextField
          label="Code"
          keyboardType="number-pad"
          placeholder="000000"
          value={token}
          onChangeText={setToken}
        />
        <PrimaryButton title={t("verify")} loading={loading} onPress={handleVerify} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "space-between"
  },
  center: {
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16
  },
  controls: {
    gap: 10,
    paddingBottom: 8
  },
  icon: {
    color: colors.accent,
    fontSize: 38
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center"
  },
  email: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "700"
  }
});
