import { Feather } from "@expo/vector-icons";
import { useCallback } from "react";
import {
  FlatList,
  Image,
  Linking,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PressableScale } from "@/components/PressableScale";
import { useApp } from "@/context/AppContext";
import { colors, platformColors, radius, spacing } from "@/lib/theme";
import type { Product } from "@/types/travio";

function WishlistCard({
  product,
  onRemove,
}: {
  product: Product;
  onRemove: (product: Product) => void;
}) {
  async function share() {
    try {
      await Share.share({
        message: `${product.title} — $${product.price.toFixed(2)} on ${product.platform}${
          product.product_url ? `\n${product.product_url}` : ""
        }`,
      });
    } catch {
      // ignore
    }
  }

  function open() {
    if (product.product_url) {
      Linking.openURL(product.product_url).catch(() => {});
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.imageWrapper}>
        {product.image_url ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image_url }} style={styles.image} />
          </View>
        ) : (
          <View style={[styles.imageContainer, styles.placeholder]}>
            <Feather name="image" size={24} color={colors.iconMuted} />
          </View>
        )}
        <PressableScale
          style={styles.removeButton}
          onPress={() => onRemove(product)}
          accessibilityLabel="Remove from wishlist"
        >
          <Feather name="x" size={14} color={colors.white} />
        </PressableScale>
        <View style={[styles.badge, { backgroundColor: platformColors[product.platform] }]}>
          <Text style={styles.badgeText}>{product.platform}</Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {product.title}
      </Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>

      <View style={styles.actions}>
        <PressableScale style={styles.actionButton} onPress={open}>
          <Feather name="external-link" size={14} color={colors.white} />
          <Text style={styles.actionText}>Open</Text>
        </PressableScale>
        <PressableScale style={styles.shareButton} onPress={share} accessibilityLabel="Share">
          <Feather name="share-2" size={16} color={colors.textPrimary} />
        </PressableScale>
      </View>
    </View>
  );
}

export default function WishlistScreen() {
  const insets = useSafeAreaInsets();
  const { savedProducts, toggleSavedProduct, refreshSavedProducts } = useApp();

  useFocusEffect(
    useCallback(() => {
      refreshSavedProducts();
    }, [refreshSavedProducts]),
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <Text style={styles.heading}>Wishlist</Text>

      {savedProducts.length === 0 ? (
        <View style={styles.empty}>
          <Feather name="heart" size={48} color={colors.iconMuted} />
          <Text style={styles.emptyText}>Add products to your wishlist</Text>
        </View>
      ) : (
        <FlatList
          data={savedProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <WishlistCard product={item} onRemove={toggleSavedProduct} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  list: {
    paddingVertical: spacing.md,
  },
  row: {
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  imageWrapper: {
    position: "relative",
  },
  imageContainer: {
    width: "100%",
    height: 120,
    borderRadius: radius.md,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  removeButton: {
    position: "absolute",
    top: spacing.xs,
    right: spacing.xs,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    bottom: spacing.xs,
    left: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
  title: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: "500",
    marginTop: spacing.xs,
    minHeight: 34,
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.accent,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  actionText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "600",
  },
  shareButton: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.md,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
