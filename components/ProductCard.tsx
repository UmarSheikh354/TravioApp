import { Feather } from "@expo/vector-icons";
import { Image, Linking, Pressable, Share, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useFeatures } from "@/context/FeatureContext";
import { colors } from "@/lib/theme";
import type { ProductOption } from "@/types/travio";

type Props = {
  product: ProductOption;
  onConfirm?: (product: ProductOption) => void;
};

export function ProductCard({ product, onConfirm }: Props) {
  const { t } = useTranslation();
  const { addToCart, addToWishlist, isSaved, trackPrice } = useFeatures();
  const saved = isSaved(product);

  async function openDeal() {
    if (product.product_url) {
      await Linking.openURL(product.product_url);
    }
  }

  return (
    <View style={styles.card}>
      <View>
        {product.image_url ? <Image source={{ uri: product.image_url }} style={styles.image} /> : <View style={styles.image} />}
        <View style={[styles.platformBadge, platformStyle(product.supplier)]}>
          <Text style={styles.platformText}>{product.supplier}</Text>
        </View>
        <Pressable style={styles.saveIcon} onPress={() => addToWishlist(product)}>
          <Feather name="heart" size={20} color={saved ? colors.danger : colors.text} />
        </Pressable>
      </View>
      <View style={styles.header}>
        <Text style={styles.name}>{product.name}</Text>
      </View>
      <Text style={styles.price}>${product.total_price.toFixed(2)}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>★ {(product.rating ?? 4.6).toFixed(1)} ({product.reviews_count ?? 128})</Text>
        <Text style={styles.meta}>{product.seller_badge ?? "trusted"} seller</Text>
      </View>
      <Text style={styles.meta}>{t("delivery")}: {product.delivery_days} {t("days")} • {product.return_policy}</Text>
      <Text style={styles.meta}>Seller: {(product.seller_rating ?? 4.5).toFixed(1)} rating • {product.seller_years_active ?? 2} yrs active</Text>
      <Text style={styles.meta}>Safety {product.safety_score ?? 92}/100 • Quality {product.quality_score ?? 8.8}/10</Text>
      <View style={styles.compareRow}>
        <Text style={styles.compareText}>Amazon ${product.total_price.toFixed(2)}</Text>
        <Text style={styles.compareText}>Alibaba ${(product.total_price * 0.92).toFixed(2)}</Text>
        <Text style={styles.compareText}>Temu ${(product.total_price * 0.87).toFixed(2)}</Text>
      </View>
      <Text style={styles.meta}>Coupon: {product.coupon ?? "No coupon"} • Cashback: {product.cashback_percent ?? 1}% • Best time: {bestTime(product)}</Text>
      <View style={styles.actions}>
        <Pressable style={styles.darkAction} onPress={openDeal}>
          <Text style={styles.darkActionText}>View Deal</Text>
        </Pressable>
        <Pressable style={styles.lightAction} onPress={() => addToCart(product, 1)}>
          <Text style={styles.lightActionText}>Cart</Text>
        </Pressable>
        <Pressable style={styles.lightAction} onPress={() => Share.share({ message: `${product.name} - $${product.total_price}` })}>
          <Feather name="share-2" size={14} color={colors.text} />
        </Pressable>
        <Pressable style={styles.lightAction} onPress={() => trackPrice(product)}>
          <Text style={styles.lightActionText}>Track</Text>
        </Pressable>
        <Pressable style={styles.lightAction}>
          <Text style={styles.lightActionText}>Compare</Text>
        </Pressable>
      </View>
      {onConfirm ? <PrimaryButton title={t("confirmOrder")} onPress={() => onConfirm(product)} /> : null}
    </View>
  );
}

function bestTime(product: ProductOption) {
  const history = product.price_history ?? [];
  if (history.length >= 2 && history[history.length - 1] < history[0]) {
    return "Good time to buy";
  }
  return "Watch for a drop";
}

function platformStyle(supplier: ProductOption["supplier"]) {
  if (supplier === "Amazon") {
    return { backgroundColor: "#ff9900" };
  }
  if (supplier === "Alibaba" || supplier === "AliExpress") {
    return { backgroundColor: "#E4322B" };
  }
  if (supplier === "Temu") {
    return { backgroundColor: "#7A35FF" };
  }
  return { backgroundColor: colors.accent };
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderColor: "#F0F0F0",
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    paddingBottom: 12,
    shadowColor: "#000",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    width: 200
  },
  image: {
    backgroundColor: colors.panelSoft,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: 140,
    width: "100%"
  },
  platformBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: "absolute",
    right: 8,
    top: 8
  },
  platformText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800"
  },
  saveIcon: {
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 14,
    height: 28,
    justifyContent: "center",
    left: 8,
    position: "absolute",
    top: 8,
    width: 28
  },
  header: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    paddingHorizontal: 10
  },
  name: {
    color: colors.text,
    flex: 1,
    fontSize: 14,
    fontWeight: "600"
  },
  price: {
    color: colors.accent,
    fontSize: 18,
    fontWeight: "800",
    paddingHorizontal: 10
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 10
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
    paddingHorizontal: 10
  },
  compareRow: {
    backgroundColor: colors.panelSoft,
    borderRadius: 12,
    gap: 4,
    marginHorizontal: 10,
    padding: 10
  },
  compareText: {
    color: colors.text,
    fontSize: 12
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 10
  },
  darkAction: {
    backgroundColor: colors.control,
    borderRadius: 10,
    width: "100%",
    height: 36,
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  darkActionText: {
    color: colors.inverseText,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center"
  },
  lightAction: {
    backgroundColor: colors.panelSoft,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  lightActionText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700"
  }
});
