import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/PrimaryButton";
import { colors } from "@/lib/theme";
import type { ProductOption } from "@/types/travio";

type Props = {
  product: ProductOption;
  onConfirm?: (product: ProductOption) => void;
};

export function ProductCard({ product, onConfirm }: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      {product.image_url ? <Image source={{ uri: product.image_url }} style={styles.image} /> : null}
      <View style={styles.header}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.total_price.toFixed(2)}</Text>
      </View>
      <Text style={styles.description}>{product.description}</Text>
      {product.category ? <Text style={styles.meta}>Category: {product.category}</Text> : null}
      <View style={styles.metaRow}>
        <Text style={styles.meta}>
          Platform: {product.supplier}
        </Text>
        <Text style={styles.meta}>★ 4.8</Text>
        <Text style={styles.meta}>
          {t("delivery")}: {product.delivery_days} {t("days")}
        </Text>
      </View>
      <View style={styles.compareRow}>
        <Text style={styles.compareText}>Amazon ${product.total_price.toFixed(2)}</Text>
        <Text style={styles.compareText}>Alibaba ${(product.total_price * 0.92).toFixed(2)}</Text>
        <Text style={styles.compareText}>Temu ${(product.total_price * 0.87).toFixed(2)}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable style={styles.darkAction}>
          <Text style={styles.darkActionText}>View Deal</Text>
        </Pressable>
        <Pressable style={styles.lightAction}>
          <Text style={styles.lightActionText}>Save</Text>
        </Pressable>
        <Pressable style={styles.lightAction}>
          <Text style={styles.lightActionText}>Compare</Text>
        </Pressable>
      </View>
      {onConfirm ? <PrimaryButton title={t("confirmOrder")} onPress={() => onConfirm(product)} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
    padding: 16
  },
  image: {
    backgroundColor: colors.panelSoft,
    borderRadius: 16,
    height: 150,
    width: "100%"
  },
  header: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  name: {
    color: colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: "800"
  },
  price: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "800"
  },
  description: {
    color: colors.muted,
    lineHeight: 20
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  meta: {
    color: colors.muted,
    fontSize: 13
  },
  compareRow: {
    backgroundColor: colors.panelSoft,
    borderRadius: 12,
    gap: 4,
    padding: 10
  },
  compareText: {
    color: colors.text,
    fontSize: 12
  },
  actions: {
    flexDirection: "row",
    gap: 8
  },
  darkAction: {
    backgroundColor: colors.control,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  darkActionText: {
    color: colors.inverseText,
    fontSize: 12,
    fontWeight: "700"
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
