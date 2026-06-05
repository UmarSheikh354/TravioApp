import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { user, orders } = useApp();
  const activeOrders = orders.filter((order) => !["delivered", "cancelled"].includes(order.status));

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>{t("appName")}</Text>
        <Text style={styles.title}>Welcome{user?.name ? `, ${user.name}` : ""}</Text>
        <Text style={styles.subtitle}>Find products globally, compare suppliers, and pay securely.</Text>
        <PrimaryButton title={t("startChat")} onPress={() => router.push("/chat")} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Order status tracking</Text>
        <Text style={styles.cardText}>
          {activeOrders.length > 0
            ? `${activeOrders.length} active order${activeOrders.length === 1 ? "" : "s"} in progress.`
            : "No active orders. Start a chat to create one."}
        </Text>
      </View>

      <View style={styles.steps}>
        {["Chat with Travio AI", "Choose a product card", "Confirm details", "Pay and track"].map((step, index) => (
          <View key={step} style={styles.step}>
            <Text style={styles.stepNumber}>{index + 1}</Text>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: "#0f1728",
    borderColor: "#24304a",
    borderRadius: 28,
    borderWidth: 1,
    gap: 14,
    padding: 22
  },
  eyebrow: {
    color: "#21d4a2",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900"
  },
  subtitle: {
    color: "#c5ccdc",
    fontSize: 16,
    lineHeight: 24
  },
  card: {
    backgroundColor: "#101827",
    borderRadius: 22,
    gap: 8,
    padding: 18
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800"
  },
  cardText: {
    color: "#9aa7bd",
    lineHeight: 21
  },
  steps: {
    gap: 12
  },
  step: {
    alignItems: "center",
    backgroundColor: "#0f1728",
    borderRadius: 18,
    flexDirection: "row",
    gap: 12,
    padding: 14
  },
  stepNumber: {
    backgroundColor: "#21d4a2",
    borderRadius: 999,
    color: "#05070d",
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  stepText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  }
});
