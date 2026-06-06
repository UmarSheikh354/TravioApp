import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { TravioMark } from "@/components/TravioMark";
import { useApp } from "@/context/AppContext";
import { colors } from "@/lib/theme";

export default function LoginScreen() {
  const { t } = useTranslation();
  const { signInWithEmail, signInWithApple, signInWithGoogle } = useApp();
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
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
      <View style={styles.center}>
        <TravioMark size={42} showWordmark />
        <Text style={styles.title}>Your AI{"\n"}Shopping{"\n"}Companion</Text>
      </View>
      <View style={styles.controls}>
        <AuthButton title={t("continueWithApple")} icon="●" loading={loading === "apple"} onPress={() => handleSocial("apple")} />
        <AuthButton title={t("continueWithGoogle")} icon="G" dark loading={loading === "google"} onPress={() => handleSocial("google")} />
        <AuthButton title="Sign up with email" icon="✉" dark onPress={() => setShowEmail((value) => !value)} />
        {showEmail ? (
          <TextField
            label={t("email")}
            keyboardType="email-address"
            placeholder="Enter email address"
            value={email}
            onChangeText={setEmail}
          />
        ) : null}
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
        <AuthButton title={t("login")} outline loading={loading === "email"} onPress={handleEmail} />
      </View>
    </Screen>
  );
}

type AuthButtonProps = {
  title: string;
  icon?: string;
  dark?: boolean;
  outline?: boolean;
  loading?: boolean;
  onPress: () => void;
};

function AuthButton({ title, icon, dark, outline, loading, onPress }: AuthButtonProps) {
  return (
    <Pressable style={[styles.authButton, dark && styles.authDark, outline && styles.authOutline]} onPress={onPress}>
      <Text style={[styles.authText, (dark || outline) && styles.authTextLight]}>
        {loading ? "..." : icon ? `${icon}  ${title}` : title}
      </Text>
    </Pressable>
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
    gap: 7,
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
    lineHeight: 14
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
  },
  authButton: {
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderRadius: 7,
    minHeight: 31,
    justifyContent: "center",
    paddingHorizontal: 12
  },
  authDark: {
    backgroundColor: "#2b2b2d"
  },
  authOutline: {
    backgroundColor: "transparent",
    borderColor: "#202020",
    borderWidth: 1
  },
  authText: {
    color: "#000000",
    fontSize: 11,
    fontWeight: "700"
  },
  authTextLight: {
    color: "#ffffff"
  }
});
