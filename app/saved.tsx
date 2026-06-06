import { Share, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { colors } from "@/lib/theme";

const savedProducts = [
  { name: "Wireless Earbuds Pro", price: "$24.99" },
  { name: "Smart Travel Backpack", price: "$39.50" },
  { name: "LED Desk Lamp", price: "$18.20" },
  { name: "Cotton Tote Bags", price: "$1.95/unit" }
];

export default function SavedProductsScreen() {
  return (
    <Screen>
      <Text style={styles.title}>Saved Products</Text>
      <View style={styles.grid}>
        {savedProducts.map((product) => (
          <View key={product.name} style={styles.card}>
            <View style={styles.image} />
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>{product.price}</Text>
            <PrimaryButton title="Share" onPress={() => Share.share({ message: `${product.name} - ${product.price}` })} />
            <PrimaryButton title="Remove" variant="secondary" onPress={() => undefined} />
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 8,
    padding: 12,
    width: "48%"
  },
  image: {
    backgroundColor: colors.panelSoft,
    borderRadius: 14,
    height: 100
  },
  name: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800"
  },
  price: {
    color: colors.muted,
    fontSize: 12
  }
});
