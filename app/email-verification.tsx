import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Screen } from "@/components/Screen";
import { TravioMark } from "@/components/TravioMark";
import { useApp } from "@/context/AppContext";
import { colors } from "@/lib/theme";

export default function EmailVerificationScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ email?: string; agreementAcceptedAt?: string }>();
  const { verifyEmail } = useApp();
  const [loading, setLoading] = useState(false);
  const email = params.email ?? "";

  async function handleVerify() {
    try {
      setLoading(true);
      await verifyEmail(email, "000000", params.agreementAcceptedAt ?? new Date().toISOString());
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(t("verification"), error instanceof Error ? error.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.topMark}>
        <TravioMark size={22} />
      </View>
      <View style={styles.center}>
        <View style={styles.envelopeWrap}>
          <Text style={styles.icon}>✉</Text>
          <View style={styles.redDot} />
        </View>
        <Text style={styles.subtitle}>Tap on the link we sent to{"\n"}{email || "your email"}</Text>
      </View>
      <View style={styles.controls}>
        <VerifyButton title={loading ? "Checking..." : "I've verified my email"} onPress={handleVerify} />
        <VerifyButton title="Sign out" onPress={() => router.replace("/login")} />
      </View>
    </Screen>
  );
}

function VerifyButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable style={styles.verifyButton} onPress={onPress}>
      <Text style={styles.verifyText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "space-between"
  },
  topMark: {
    alignItems: "flex-end"
  },
  center: {
    alignItems: "center",
    gap: 24,
    paddingHorizontal: 16
  },
  controls: {
    gap: 8,
    paddingBottom: 8
  },
  envelopeWrap: {
    position: "relative"
  },
  icon: {
    color: colors.accent,
    fontSize: 46
  },
  redDot: {
    backgroundColor: "#ff453f",
    borderRadius: 6,
    height: 12,
    position: "absolute",
    right: -2,
    top: 5,
    width: 12
  },
  subtitle: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center"
  },
  verifyButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 7,
    justifyContent: "center",
    minHeight: 38
  },
  verifyText: {
    color: "#000000",
    fontSize: 11,
    fontWeight: "700"
  }
});
