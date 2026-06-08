import { Feather } from "@expo/vector-icons";
import { Image, Pressable, Share, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { useFeatures } from "@/context/FeatureContext";
import { colors } from "@/lib/theme";

export default function SavedProductsScreen() {
  const { removeFromWishlist, wishlist } = useFeatures();

  return (
    <Screen>
      <Text style={styles.title}>Saved Products</Text>
      {wishlist.length === 0 ? <Text style={styles.empty}>Saved products will appear here.</Text> : null}
      <View style={styles.grid}>
        {wishlist.map((product) => (
          <View key={`${product.id}-${product.name}`} style={styles.card}>
            <Pressable style={styles.remove} onPress={() => removeFromWishlist(product.id)}>
              <Feather name="x" size={20} color={colors.text} />
            </Pressable>
            {product.image_url ? <Image source={{ uri: product.image_url }} style={styles.image} /> : <View style={styles.image} />}
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.price}>${product.total_price.toFixed(2)}</Text>
            <PrimaryButton title="Share" onPress={() => Share.share({ message: `${product.name} - $${product.total_price}` })} />
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
    overflow: "hidden",
    paddingBottom: 12,
    width: "48%"
  },
  remove: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 14,
    height: 28,
    justifyContent: "center",
    position: "absolute",
    right: 8,
    top: 8,
    width: 28,
    zIndex: 1
  },
  image: {
    backgroundColor: colors.panelSoft,
    height: 160,
    width: "100%"
  },
  name: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800",
    paddingHorizontal: 10
  },
  price: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: "900",
    paddingHorizontal: 10
  },
  empty: {
    color: colors.muted,
    fontSize: 16
  }
});
