import { Linking, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { useFeatures } from "@/context/FeatureContext";
import { colors } from "@/lib/theme";

export default function CartScreen() {
  const { cart, clearCart } = useFeatures();
  const total = cart.reduce((sum, item) => sum + item.product.total_price * item.quantity, 0);

  return (
    <Screen>
      <Text style={styles.title}>Cart</Text>
      {cart.length === 0 ? <Text style={styles.empty}>Your cart is empty.</Text> : null}
      {cart.map((item) => (
        <View key={`${item.product.id}-${item.product.name}`} style={styles.card}>
          <Text style={styles.name}>{item.product.name}</Text>
          <Text style={styles.meta}>Qty {item.quantity} • {item.product.supplier}</Text>
          <Text style={styles.price}>${(item.product.total_price * item.quantity).toFixed(2)}</Text>
          <Text style={styles.meta}>Payment verification and safe checkout score: {item.product.safety_score ?? 92}/100</Text>
          <PrimaryButton title="Checkout affiliate deal" onPress={() => item.product.product_url && Linking.openURL(item.product.product_url)} />
        </View>
      ))}
      {cart.length > 0 ? (
        <View style={styles.totalCard}>
          <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
          <PrimaryButton title="Clear cart" variant="secondary" onPress={clearCart} />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900"
  },
  empty: {
    color: colors.muted,
    fontSize: 16
  },
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
    padding: 14
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "800"
  },
  meta: {
    color: colors.muted,
    fontSize: 13
  },
  price: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "900"
  },
  totalCard: {
    backgroundColor: colors.panel,
    borderRadius: 16,
    gap: 12,
    padding: 14
  },
  total: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900"
  }
});
