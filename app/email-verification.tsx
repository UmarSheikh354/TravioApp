import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PressableScale } from "@/components/PressableScale";
import { useApp } from "@/context/AppContext";
import { colors, radius, spacing } from "@/lib/theme";

export default function EmailVerificationScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useApp();
  const { email } = useLocalSearchParams<{ email?: string }>();

  async function handleSignOut() {
    await signOut();
    router.replace("/onboarding");
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <View style={styles.iconWrapper}>
          <Feather name="mail" size={56} color={colors.white} />
          <View style={styles.redDot} />
        </View>
        <Text style={styles.title}>Verify your email</Text>
        <Text style={styles.subtitle}>
          Tap on the link we sent to{"\n"}
          <Text style={styles.email}>{email ?? "your email"}</Text>
        </Text>
      </View>

      <View style={[styles.actions, { paddingBottom: insets.bottom + spacing.lg }]}>
        <PressableScale style={styles.primary} onPress={() => router.replace("/(tabs)")}>
          <Text style={styles.primaryText}>I&apos;ve verified my email</Text>
        </PressableScale>
        <PressableScale style={styles.secondary} onPress={handleSignOut}>
          <Text style={styles.secondaryText}>Sign out</Text>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
    paddingHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.lg,
  },
  iconWrapper: {
    position: "relative",
  },
  redDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.danger,
  },
  title: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    color: colors.iconMuted,
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  email: {
    color: colors.white,
    fontWeight: "600",
  },
  actions: {
    gap: spacing.md,
  },
  primary: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  primaryText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "600",
  },
  secondary: {
    backgroundColor: colors.darkSurface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  secondaryText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
