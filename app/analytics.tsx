import { StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
import { useFeatures } from "@/context/FeatureContext";
import { colors } from "@/lib/theme";

const categories = [
  { label: "Electronics", value: 42 },
  { label: "Fashion", value: 24 },
  { label: "Home", value: 18 },
  { label: "Beauty", value: 16 }
];

export default function AnalyticsScreen() {
  const { orders } = useApp();
  const { trackedProducts, wishlist } = useFeatures();
  const monthlySpend = orders.reduce((sum, order) => sum + order.total_price, 0);
  const saved = trackedProducts.reduce((sum, product) => sum + product.total_price * 0.08, 0);

  return (
    <Screen>
      <Text style={styles.title}>Analytics</Text>
      <View style={styles.metricGrid}>
        <Metric label="Monthly spend" value={`$${monthlySpend.toFixed(2)}`} />
        <Metric label="Money saved" value={`$${saved.toFixed(2)}`} />
        <Metric label="Shopping streak" value="7 days" />
        <Metric label="Loyalty points" value={`${wishlist.length * 25 + orders.length * 100}`} />
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Monthly spending</Text>
        {[80, 130, 90, 180, 120].map((height, index) => (
          <View key={index} style={styles.barRow}>
            <Text style={styles.barLabel}>W{index + 1}</Text>
            <View style={[styles.bar, { width: height }]} />
          </View>
        ))}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Top categories</Text>
        {categories.map((category) => (
          <View key={category.label} style={styles.categoryRow}>
            <Text style={styles.categoryLabel}>{category.label}</Text>
            <Text style={styles.categoryValue}>{category.value}%</Text>
          </View>
        ))}
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Achievements</Text>
        <Text style={styles.meta}>🏅 Deal Finder • 🛒 Smart Shopper • 💙 Travio Loyalist</Text>
      </View>
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900"
  },
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  metric: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    padding: 14,
    width: "48%"
  },
  metricValue: {
    color: colors.accent,
    fontSize: 20,
    fontWeight: "900"
  },
  metricLabel: {
    color: colors.muted,
    fontSize: 12
  },
  card: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    gap: 10,
    padding: 14
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "900"
  },
  barRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  barLabel: {
    color: colors.muted,
    width: 28
  },
  bar: {
    backgroundColor: colors.accent,
    borderRadius: 999,
    height: 12
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  categoryLabel: {
    color: colors.text
  },
  categoryValue: {
    color: colors.muted
  },
  meta: {
    color: colors.muted,
    lineHeight: 22
  }
});
