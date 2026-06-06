import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { TravioHeader, TravioMark } from "@/components/TravioMark";
import { useApp } from "@/context/AppContext";
import { colors } from "@/lib/theme";

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
      <TravioHeader />
      <View style={styles.center}>
        <TravioMark size={42} />
        <Text style={styles.title}>Your AI{"\n"}Shopping{"\n"}Companion</Text>
      </View>
      <View style={styles.controls}>
        <PrimaryButton
          title={t("continueWithApple")}
          loading={loading === "apple"}
          disabled={!agreed}
          onPress={() => handleSocial("apple")}
        />
        <PrimaryButton
          title={t("continueWithGoogle")}
          loading={loading === "google"}
          disabled={!agreed}
          onPress={() => handleSocial("google")}
        />
        <TextField
          label={t("email")}
          keyboardType="email-address"
          placeholder="Enter email address"
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
            <Text style={styles.link}>Terms</Text>
          </Pressable>
          <Text style={styles.separator}>•</Text>
          <Pressable onPress={() => router.push("/privacy-policy")}>
            <Text style={styles.link}>Privacy</Text>
          </Pressable>
        </View>
        <PrimaryButton
          title={t("login")}
          variant="secondary"
          loading={loading === "email"}
          disabled={!email.includes("@") || !agreed}
          onPress={handleEmail}
        />
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
    gap: 18
  },
  controls: {
    gap: 8,
    paddingBottom: 8
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 24,
    textAlign: "center"
  },
  agreementRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
    marginTop: 2
  },
  checkbox: {
    alignItems: "center",
    borderColor: colors.dim,
    borderRadius: 6,
    borderWidth: 1,
    height: 24,
    justifyContent: "center",
    width: 24
  },
  checked: {
    backgroundColor: colors.accent,
    borderColor: colors.accent
  },
  checkmark: {
    color: colors.accentText,
    fontWeight: "900"
  },
  agreementText: {
    color: colors.muted,
    flex: 1,
    fontSize: 11,
    lineHeight: 20
  },
  linkRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  link: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "800"
  },
  separator: {
    color: colors.dim
  }
});
