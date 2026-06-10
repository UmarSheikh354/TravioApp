import { Feather } from "@expo/vector-icons";
import { Image, Linking, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { PressableScale } from "@/components/PressableScale";
import { colors, platformColors, radius, spacing } from "@/lib/theme";
import type { Product } from "@/types/travio";

interface ProductCardProps {
  product: Product;
  index?: number;
  saved?: boolean;
  grid?: boolean;
  onToggleSave?: (product: Product) => void;
}

function Stars({ rating }: { rating: number | null }) {
  if (!rating) {
    return null;
  }
  return (
    <View style={styles.rating}>
      <Feather name="star" size={12} color="#F5A623" />
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
}

export function ProductCard({
  product,
  index = 0,
  saved = false,
  grid = false,
  onToggleSave,
}: ProductCardProps) {
  function openDeal() {
    if (product.product_url) {
      Linking.openURL(product.product_url).catch(() => {});
    }
  }

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(300)}
      style={[styles.card, grid && styles.gridCard]}
    >
      <View style={styles.imageWrapper}>
        {product.image_url ? (
          <Image source={{ uri: product.image_url }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Feather name="image" size={28} color={colors.iconMuted} />
          </View>
        )}
        <PressableScale
          style={styles.saveButton}
          onPress={() => onToggleSave?.(product)}
          accessibilityLabel={saved ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Feather
            name="heart"
            size={16}
            color={saved ? colors.danger : colors.textPrimary}
          />
        </PressableScale>
        <View
          style={[
            styles.badge,
            { backgroundColor: platformColors[product.platform] },
          ]}
        >
          <Text style={styles.badgeText}>{product.platform}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <View style={styles.metaRow}>
          <Text style={styles.price}>
            ${product.price.toFixed(2)}
          </Text>
          <Stars rating={product.rating} />
        </View>
        <PressableScale style={styles.dealButton} onPress={openDeal}>
          <Text style={styles.dealText}>View Deal</Text>
          <Feather name="external-link" size={14} color={colors.white} />
        </PressableScale>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 200,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginRight: spacing.md,
  },
  gridCard: {
    width: "100%",
    marginRight: 0,
    marginBottom: spacing.md,
  },
  imageWrapper: {
    width: "100%",
    height: 140,
    position: "relative",
  },
  image: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  saveButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    bottom: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  badgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "700",
  },
  body: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: "500",
    minHeight: 36,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.accent,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dealButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  dealText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
});
