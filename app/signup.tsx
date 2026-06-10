import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Logo } from "@/components/Logo";
import { PressableScale } from "@/components/PressableScale";
import { useApp } from "@/context/AppContext";
import { isSupabaseConfigured } from "@/lib/supabase";
import { colors, radius, spacing } from "@/lib/theme";

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { signUpWithEmail } = useApp();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!fullName.trim() || !email.trim() || password.length < 6) {
      Alert.alert(
        "Check your details",
        "Enter your name, email, and a password of at least 6 characters.",
      );
      return;
    }
    setLoading(true);
    try {
      await signUpWithEmail(email.trim(), password, fullName.trim());
      if (isSupabaseConfigured) {
        router.replace({ pathname: "/email-verification", params: { email: email.trim() } });
      } else {
        router.replace("/(tabs)");
      }
    } catch (error) {
      Alert.alert("Sign up failed", (error as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={[styles.content, { paddingTop: insets.top + spacing.xxl }]}>
        <PressableScale
          style={styles.back}
          onPress={() => router.back()}
          accessibilityLabel="Go back"
        >
          <Feather name="arrow-left" size={22} color={colors.white} />
        </PressableScale>

        <View style={styles.header}>
          <Logo size={56} />
          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Join Travio and shop smarter</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="Full name"
            placeholderTextColor={colors.iconMuted}
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor={colors.iconMuted}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.iconMuted}
            secureTextEntry
          />
          <PressableScale style={styles.primary} onPress={submit} disabled={loading}>
            <Text style={styles.primaryText}>
              {loading ? "Creating account..." : "Sign up"}
            </Text>
          </PressableScale>
        </View>

        <PressableScale style={styles.footerLink} onPress={() => router.replace("/login")}>
          <Text style={styles.footerText}>
            Already have an account? <Text style={styles.footerStrong}>Log in</Text>
          </Text>
        </PressableScale>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  back: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  title: {
    color: colors.white,
    fontSize: 26,
    fontWeight: "700",
    marginTop: spacing.md,
  },
  subtitle: {
    color: colors.iconMuted,
    fontSize: 14,
    textAlign: "center",
  },
  form: {
    gap: spacing.md,
  },
  input: {
    backgroundColor: colors.darkSurface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.white,
    fontSize: 16,
  },
  primary: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  primaryText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "600",
  },
  footerLink: {
    marginTop: spacing.xl,
    alignItems: "center",
  },
  footerText: {
    color: colors.iconMuted,
    fontSize: 14,
  },
  footerStrong: {
    color: colors.white,
    fontWeight: "600",
  },
});
