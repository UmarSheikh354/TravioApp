import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PressableScale } from "@/components/PressableScale";
import { useApp } from "@/context/AppContext";
import { colors, radius, spacing } from "@/lib/theme";
import type { Platform } from "@/types/travio";

interface SettingsSheetProps {
  visible: boolean;
  onClose: () => void;
}

const APP_VERSION = "1.2024.136 (Travio for iOS)";
const COLOR_SCHEMES: ("system" | "light" | "dark")[] = ["system", "light", "dark"];
const MARKETPLACES: Platform[] = ["Amazon", "Alibaba", "AliExpress", "Temu"];

function SectionTitle({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

function Row({
  icon,
  label,
  value,
  onPress,
  right,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <PressableScale style={styles.row} onPress={onPress} disabled={!onPress}>
      <Feather name={icon} size={18} color={colors.textPrimary} />
      <Text style={styles.rowLabel}>{label}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      {right}
      {onPress && !right ? (
        <Feather name="chevron-right" size={18} color={colors.iconMuted} />
      ) : null}
    </PressableScale>
  );
}

export function SettingsSheet({ visible, onClose }: SettingsSheetProps) {
  const insets = useSafeAreaInsets();
  const { user, preferences, updatePreferences, signOut } = useApp();
  const [savingNotice, setSavingNotice] = useState(false);

  function cycleColorScheme() {
    const current = preferences.colorScheme ?? "system";
    const next = COLOR_SCHEMES[(COLOR_SCHEMES.indexOf(current) + 1) % COLOR_SCHEMES.length];
    updatePreferences({ colorScheme: next });
  }

  function toggleMarketplace(platform: Platform, value: boolean) {
    updatePreferences({
      marketplaces: {
        ...(preferences.marketplaces ?? {
          Amazon: true,
          Alibaba: true,
          AliExpress: true,
          Temu: true,
        }),
        [platform]: value,
      },
    });
    setSavingNotice(true);
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
            <PressableScale onPress={onClose} hitSlop={8} accessibilityLabel="Close settings">
              <Feather name="x" size={22} color={colors.textSecondary} />
            </PressableScale>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <SectionTitle title="Account" />
            <View style={styles.card}>
              <Row icon="mail" label="Email" value={user?.email ?? "—"} />
              <Row
                icon="plus-square"
                label="Subscription"
                value={user?.subscription_tier ?? "Free"}
              />
            </View>

            <SectionTitle title="Data" />
            <View style={styles.card}>
              <Row icon="database" label="Data Controls" onPress={() => {}} />
              <Row icon="archive" label="Archived Chats" onPress={() => {}} />
              <Row
                icon="book-open"
                label="Custom Instructions"
                value={preferences.customInstructions ? "On" : "Off"}
                onPress={() => {}}
              />
            </View>

            <SectionTitle title="App" />
            <View style={styles.card}>
              <Row
                icon="sun"
                label="Color Scheme"
                value={preferences.colorScheme ?? "system"}
                onPress={cycleColorScheme}
              />
              <Row
                icon="smartphone"
                label="Haptic Feedback"
                right={
                  <Switch
                    value={preferences.hapticFeedback ?? true}
                    onValueChange={(value) => updatePreferences({ hapticFeedback: value })}
                    trackColor={{ true: colors.success, false: "#CCCCCC" }}
                  />
                }
              />
            </View>

            <SectionTitle title="Marketplaces" />
            <View style={styles.card}>
              {MARKETPLACES.map((platform) => (
                <Row
                  key={platform}
                  icon="shopping-bag"
                  label={platform}
                  right={
                    <Switch
                      value={preferences.marketplaces?.[platform] ?? true}
                      onValueChange={(value) => toggleMarketplace(platform, value)}
                      trackColor={{ true: colors.success, false: "#CCCCCC" }}
                    />
                  }
                />
              ))}
            </View>

            <SectionTitle title="Speech" />
            <View style={styles.card}>
              <Row icon="mic" label="Voice" value={preferences.voice ?? "Breeze"} onPress={() => {}} />
              <Row
                icon="globe"
                label="Main Language"
                value={preferences.language ?? "Auto-Detect"}
                onPress={() => {}}
              />
            </View>

            <SectionTitle title="About" />
            <View style={styles.card}>
              <Row
                icon="help-circle"
                label="Help Center"
                onPress={() => Linking.openURL("https://travio.app/help").catch(() => {})}
              />
              <Row
                icon="file-text"
                label="Terms of Use"
                onPress={() => Linking.openURL("https://travio.app/terms").catch(() => {})}
              />
              <Row
                icon="lock"
                label="Privacy Policy"
                onPress={() => Linking.openURL("https://travio.app/privacy").catch(() => {})}
              />
              <Row icon="info" label="Version" value={APP_VERSION} />
            </View>

            {savingNotice && (
              <Text style={styles.notice}>Marketplace preferences updated.</Text>
            )}

            <PressableScale
              style={styles.logout}
              onPress={() => {
                onClose();
                signOut();
              }}
            >
              <Feather name="log-out" size={18} color={colors.danger} />
              <Text style={styles.logoutText}>Logout</Text>
            </PressableScale>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    maxHeight: "92%",
    backgroundColor: colors.settingsBackground,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  rowValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  notice: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: spacing.md,
    textAlign: "center",
  },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.lg,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.danger,
  },
});
