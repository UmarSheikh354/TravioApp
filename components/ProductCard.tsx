import { Image, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/PrimaryButton";
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
      <View style={styles.metaRow}>
        <Text style={styles.meta}>
          {t("supplier")}: {product.supplier}
        </Text>
        <Text style={styles.meta}>
          {t("delivery")}: {product.delivery_days} {t("days")}
        </Text>
      </View>
      <Text style={styles.meta}>Unit: ${product.price_per_unit.toFixed(2)}</Text>
      {onConfirm ? <PrimaryButton title={t("confirmOrder")} onPress={() => onConfirm(product)} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0f1728",
    borderColor: "#24304a",
    borderRadius: 22,
    borderWidth: 1,
    gap: 12,
    padding: 16
  },
  image: {
    backgroundColor: "#1d2638",
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
    color: "#fff",
    flex: 1,
    fontSize: 18,
    fontWeight: "800"
  },
  price: {
    color: "#21d4a2",
    fontSize: 18,
    fontWeight: "800"
  },
  description: {
    color: "#c5ccdc",
    lineHeight: 20
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  meta: {
    color: "#9aa7bd",
    fontSize: 13
  }
});
