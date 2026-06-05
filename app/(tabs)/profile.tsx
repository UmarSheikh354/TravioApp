import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
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
    <Screen>
      <Text style={styles.title}>{t("profile")}</Text>
      <View style={styles.card}>
        <Text style={styles.name}>{user?.name ?? "Guest"}</Text>
        <Text style={styles.email}>{user?.email ?? "guest@travio.local"}</Text>
        {user?.phone ? <Text style={styles.email}>{user.phone}</Text> : null}
        {user?.agreement_accepted_at ? (
          <Text style={styles.meta}>Agreement accepted: {new Date(user.agreement_accepted_at).toLocaleString()}</Text>
        ) : null}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t("language")}</Text>
        <View style={styles.languageRow}>
          {languages.map((item) => (
            <Pressable
              key={item.value}
              onPress={() => setLanguage(item.value)}
              style={[styles.languagePill, language === item.value && styles.activeLanguage]}
            >
              <Text style={[styles.languageText, language === item.value && styles.activeLanguageText]}>
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Backend status</Text>
        <Text style={styles.statusText}>
          Add real values to .env to enable Claude, marketplace APIs, Stripe PaymentIntent, and Supabase database writes.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <Pressable onPress={() => router.push("/terms-conditions")}>
          <Text style={styles.link}>Terms and Conditions</Text>
        </Pressable>
        <Pressable onPress={() => router.push("/privacy-policy")}>
          <Text style={styles.link}>Privacy Policy</Text>
        </Pressable>
      </View>

      <PrimaryButton title={t("logout")} variant="secondary" onPress={handleLogout} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900"
  },
  card: {
    backgroundColor: "#0f1728",
    borderColor: "#24304a",
    borderRadius: 22,
    borderWidth: 1,
    gap: 10,
    padding: 16
  },
  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900"
  },
  email: {
    color: "#9aa7bd"
  },
  meta: {
    color: "#c5ccdc",
    fontSize: 13
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800"
  },
  languageRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  languagePill: {
    borderColor: "#2c3448",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  activeLanguage: {
    backgroundColor: "#21d4a2",
    borderColor: "#21d4a2"
  },
  languageText: {
    color: "#d7deee",
    fontWeight: "700"
  },
  activeLanguageText: {
    color: "#05070d"
  },
  statusText: {
    color: "#c5ccdc",
    lineHeight: 22
  },
  link: {
    color: "#21d4a2",
    fontSize: 16,
    fontWeight: "800"
  }
});
