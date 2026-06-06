import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import { AuthButtons } from "@/components/AuthButtons";
import { Screen } from "@/components/Screen";
import { TravioMark } from "@/components/TravioMark";
import { useApp } from "@/context/AppContext";
import { colors } from "@/lib/theme";

export default function LoginScreen() {
  const { t } = useTranslation();
  const { signInWithEmail, signInWithApple, signInWithGoogle } = useApp();
  const [email, setEmail] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [loading, setLoading] = useState<"email" | "apple" | "google" | null>(null);

  function acceptanceTimestamp() {
    return new Date().toISOString();
  }

  async function handleEmail() {
    if (!showEmail) {
      setShowEmail(true);
      return;
    }

    if (!email.includes("@")) {
      Alert.alert(t("login"), "Enter your email address first.");
      return;
    }

    try {
      setLoading("email");
      const agreementAcceptedAt = acceptanceTimestamp();
      await signInWithEmail(email, agreementAcceptedAt);
      router.push({ pathname: "/email-verification", params: { email, agreementAcceptedAt } });
    } catch (error) {
      Alert.alert(t("login"), error instanceof Error ? error.message : "Email login failed.");
    } finally {
      setLoading(null);
    }
  }

  async function handleSocial(provider: "apple" | "google") {
    try {
      setLoading(provider);
      const agreementAcceptedAt = acceptanceTimestamp();
      if (provider === "apple") {
        await signInWithApple(agreementAcceptedAt);
      } else {
        await signInWithGoogle(agreementAcceptedAt);
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
      <View style={styles.glow} />
      <View style={styles.center}>
        <TravioMark size={46} showWordmark />
      </View>
      <View style={styles.controls}>
        {showEmail ? (
          <TextInput
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={setEmail}
            placeholder="Enter email address"
            placeholderTextColor="#777"
            style={styles.emailInput}
            value={email}
          />
        ) : null}
        <AuthButtons
          loading={loading}
          onApple={() => handleSocial("apple")}
          onGoogle={() => handleSocial("google")}
          onEmail={handleEmail}
          onLogin={() => (showEmail ? handleEmail() : setShowEmail(true))}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "space-between"
  },
  glow: {
    backgroundColor: "rgba(255,255,255,0.035)",
    borderRadius: 160,
    height: 260,
    left: "50%",
    marginLeft: -130,
    position: "absolute",
    top: 120,
    width: 260
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 170
  },
  controls: {
    gap: 8,
    paddingBottom: 10
  },
  emailInput: {
    backgroundColor: "#f7f7f7",
    borderRadius: 7,
    color: colors.accentText,
    fontSize: 12,
    minHeight: 31,
    paddingHorizontal: 12
  }
});
