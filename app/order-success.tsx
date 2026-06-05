import { router, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";

export default function OrderSuccessScreen() {
  const { t } = useTranslation();
  const { latestOrder } = useApp();
  const params = useLocalSearchParams<{ tracking?: string }>();
  const tracking = latestOrder?.tracking_number ?? params.tracking ?? "TRV-PENDING";

  return (
    <Screen scroll={false} style={styles.screen}>
      <View style={styles.successBadge}>
        <Text style={styles.check}>✓</Text>
      </View>
      <Text style={styles.title}>{t("orderSuccess")}</Text>
      <Text style={styles.subtitle}>Your order has been saved and tracking has started.</Text>
      <View style={styles.card}>
        <Text style={styles.label}>{t("trackingNumber")}</Text>
        <Text style={styles.tracking}>{tracking}</Text>
      </View>
      <PrimaryButton title={t("orders")} onPress={() => router.replace("/(tabs)/orders")} />
      <PrimaryButton title={t("backHome")} variant="secondary" onPress={() => router.replace("/(tabs)")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    justifyContent: "center"
  },
  successBadge: {
    alignItems: "center",
    backgroundColor: "#21d4a2",
    borderRadius: 999,
    height: 94,
    justifyContent: "center",
    width: 94
  },
  check: {
    color: "#05070d",
    fontSize: 52,
    fontWeight: "900"
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center"
  },
  subtitle: {
    color: "#c5ccdc",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center"
  },
  card: {
    alignItems: "center",
    backgroundColor: "#0f1728",
    borderColor: "#24304a",
    borderRadius: 22,
    borderWidth: 1,
    gap: 8,
    padding: 20,
    width: "100%"
  },
  label: {
    color: "#9aa7bd",
    fontWeight: "700",
    textTransform: "uppercase"
  },
  tracking: {
    color: "#21d4a2",
    fontSize: 22,
    fontWeight: "900"
  }
});
