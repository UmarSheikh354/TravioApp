import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { useApp } from "@/context/AppContext";

export default function LoginScreen() {
  const { t } = useTranslation();
  const { signInWithEmail, signInWithApple, signInWithGoogle } = useApp();
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState<"email" | "apple" | "google" | null>(null);

  function acceptanceTimestamp() {
    if (!agreed) {
      throw new Error("You must agree to Terms and Privacy Policy before signing up.");
    }

    return new Date().toISOString();
  }

  async function handleEmail() {
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
      <Text style={styles.title}>{t("login")}</Text>
      <Text style={styles.subtitle}>Access Travio to search, pay, and track orders.</Text>
      <PrimaryButton
        title={t("continueWithApple")}
        variant="secondary"
        loading={loading === "apple"}
        disabled={!agreed}
        onPress={() => handleSocial("apple")}
      />
      <PrimaryButton
        title={t("continueWithGoogle")}
        variant="secondary"
        loading={loading === "google"}
        disabled={!agreed}
        onPress={() => handleSocial("google")}
      />
      <TextField
        label={t("email")}
        keyboardType="email-address"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
      />
      <Pressable style={styles.agreementRow} onPress={() => setAgreed((value) => !value)}>
        <View style={[styles.checkbox, agreed && styles.checked]}>
          {agreed ? <Text style={styles.checkmark}>✓</Text> : null}
        </View>
        <Text style={styles.agreementText}>I agree to Terms and Privacy Policy</Text>
      </Pressable>
      <View style={styles.linkRow}>
        <Pressable onPress={() => router.push("/terms-conditions")}>
          <Text style={styles.link}>Terms and Conditions</Text>
        </Pressable>
        <Text style={styles.separator}>•</Text>
        <Pressable onPress={() => router.push("/privacy-policy")}>
          <Text style={styles.link}>Privacy Policy</Text>
        </Pressable>
      </View>
      <PrimaryButton
        title={t("continueWithEmail")}
        loading={loading === "email"}
        disabled={!email.includes("@") || !agreed}
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
  },
  agreementRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12
  },
  checkbox: {
    alignItems: "center",
    borderColor: "#536078",
    borderRadius: 6,
    borderWidth: 1,
    height: 24,
    justifyContent: "center",
    width: 24
  },
  checked: {
    backgroundColor: "#21d4a2",
    borderColor: "#21d4a2"
  },
  checkmark: {
    color: "#05070d",
    fontWeight: "900"
  },
  agreementText: {
    color: "#d7deee",
    flex: 1,
    lineHeight: 20
  },
  linkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  link: {
    color: "#21d4a2",
    fontWeight: "800"
  },
  separator: {
    color: "#536078"
  }
});
