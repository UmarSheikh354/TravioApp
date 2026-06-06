import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
import { colors } from "@/lib/theme";
import type { SupportedLanguage } from "@/types/travio";

const languages: { label: string; value: SupportedLanguage }[] = [
  { label: "English", value: "en" },
  { label: "Urdu", value: "ur" },
  { label: "Arabic", value: "ar" }
];

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, language, setLanguage, logout } = useApp();

  async function handleLogout() {
    try {
      await logout();
      router.replace("/login");
    } catch (error) {
      Alert.alert(t("profile"), error instanceof Error ? error.message : "Logout failed.");
    }
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Pressable style={styles.close} onPress={() => router.replace("/(tabs)")}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.group}>
          <SettingsRow icon="✉" label="Email" value={user?.email ?? "guest@travio.local"} />
          <SettingsRow icon="⊞" label="Subscription" value="Travio Plus" />
        </View>

        <View style={styles.group}>
          <SettingsRow icon="▣" label="Data Controls" value="›" />
          <SettingsRow icon="▤" label="Archived Chats" value="›" onPress={() => router.push("/(tabs)/orders")} />
          <SettingsRow icon="▯" label="Custom instructions" value="On ›" />
        </View>

        <Text style={styles.sectionLabel}>APP</Text>
        <View style={styles.group}>
          <SettingsRow icon="☼" label="Color Scheme" value="System ↕" />
          <View style={styles.row}>
            <Text style={styles.rowIcon}>▯</Text>
            <Text style={styles.rowLabel}>Haptic Feedback</Text>
            <Switch value trackColor={{ true: "#34c759", false: "#c9c9c9" }} thumbColor="#ffffff" />
          </View>
        </View>

        <Text style={styles.sectionLabel}>SPEECH</Text>
        <View style={styles.group}>
          <SettingsRow icon="≋" label="Voice" value="Breeze ›" onPress={() => router.push("/voice-intro")} />
          <SettingsRow
            icon="◎"
            label="Main Language"
            value={`${languages.find((item) => item.value === language)?.label ?? "Auto-Detect"} ↕`}
            onPress={() => setLanguage(language === "en" ? "ur" : language === "ur" ? "ar" : "en")}
          />
        </View>
        <Text style={styles.note}>For best results, select the language you mainly speak.</Text>

        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.group}>
          <SettingsRow icon="?" label="Help Center" />
          <SettingsRow icon="▤" label="Terms of Use" onPress={() => router.push("/terms-conditions")} />
          <SettingsRow icon="▣" label="Privacy Policy" onPress={() => router.push("/privacy-policy")} />
          <SettingsRow icon="●" label="TRAVIO for iOS" value="1.0.0" />
        </View>

        <Pressable style={styles.logoutRow} onPress={handleLogout}>
          <Text style={styles.rowIcon}>↪</Text>
          <Text style={styles.rowLabel}>{t("logout")}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

type SettingsRowProps = {
  icon: string;
  label: string;
  value?: string;
  onPress?: () => void;
};

function SettingsRow({ icon, label, value, onPress }: SettingsRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={styles.rowLabel}>{label}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.sheet,
    paddingHorizontal: 12,
    paddingVertical: 20
  },
  sheet: {
    backgroundColor: colors.sheet,
    borderRadius: 34,
    flex: 1,
    gap: 11,
    padding: 16
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 34
  },
  headerTitle: {
    color: colors.sheetText,
    fontSize: 16,
    fontWeight: "800"
  },
  close: {
    alignItems: "center",
    backgroundColor: "#cfcfd2",
    borderRadius: 12,
    height: 24,
    justifyContent: "center",
    position: "absolute",
    right: 0,
    width: 24
  },
  closeText: {
    color: "#9d9da3",
    fontWeight: "900"
  },
  sectionLabel: {
    color: colors.sheetMuted,
    fontSize: 10,
    fontWeight: "800",
    marginTop: 6
  },
  group: {
    backgroundColor: colors.sheetCard,
    borderRadius: 9,
    overflow: "hidden"
  },
  row: {
    alignItems: "center",
    borderBottomColor: "#dfdfe2",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    minHeight: 38,
    paddingHorizontal: 12
  },
  rowIcon: {
    color: colors.sheetText,
    fontSize: 15,
    width: 24
  },
  rowLabel: {
    color: colors.sheetText,
    flex: 1,
    fontSize: 13,
    fontWeight: "500"
  },
  rowValue: {
    color: colors.sheetMuted,
    fontSize: 12
  },
  note: {
    color: colors.sheetMuted,
    fontSize: 10,
    lineHeight: 13
  },
  logoutRow: {
    alignItems: "center",
    backgroundColor: colors.sheetCard,
    borderRadius: 9,
    flexDirection: "row",
    minHeight: 38,
    paddingHorizontal: 12
  }
});
