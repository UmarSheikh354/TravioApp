import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PressableScale } from "@/components/PressableScale";
import { SettingsSheet } from "@/components/SettingsSheet";
import { useApp } from "@/context/AppContext";
import { colors, radius, spacing } from "@/lib/theme";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, savedProducts, signOut } = useApp();
  const [settingsOpen, setSettingsOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.replace("/onboarding");
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingTop: insets.top + spacing.lg, paddingBottom: insets.bottom + spacing.xl },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user?.full_name ?? user?.email ?? "T").charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{user?.full_name ?? "Travio User"}</Text>
        <Text style={styles.email}>{user?.email ?? "Not signed in"}</Text>
        <View style={styles.tierBadge}>
          <Feather name="star" size={12} color={colors.accent} />
          <Text style={styles.tierText}>{user?.subscription_tier ?? "Free"} plan</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{savedProducts.length}</Text>
          <Text style={styles.statLabel}>Saved products</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>4</Text>
          <Text style={styles.statLabel}>Marketplaces</Text>
        </View>
      </View>

      <View style={styles.menu}>
        <PressableScale style={styles.menuRow} onPress={() => router.push("/(tabs)/wishlist")}>
          <Feather name="heart" size={18} color={colors.textPrimary} />
          <Text style={styles.menuLabel}>Saved Products</Text>
          <Feather name="chevron-right" size={18} color={colors.iconMuted} />
        </PressableScale>
        <PressableScale style={styles.menuRow} onPress={() => setSettingsOpen(true)}>
          <Feather name="settings" size={18} color={colors.textPrimary} />
          <Text style={styles.menuLabel}>Settings</Text>
          <Feather name="chevron-right" size={18} color={colors.iconMuted} />
        </PressableScale>
      </View>

      <PressableScale style={styles.logout} onPress={handleSignOut}>
        <Feather name="log-out" size={18} color={colors.danger} />
        <Text style={styles.logoutText}>Logout</Text>
      </PressableScale>

      <SettingsSheet visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  profileCard: {
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "700",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    marginTop: spacing.xs,
  },
  tierText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    alignItems: "center",
    gap: spacing.xs,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  menu: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.md,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.danger,
  },
});
