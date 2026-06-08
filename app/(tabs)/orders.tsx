import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";

export default function OrdersHistoryScreen() {
  const { t } = useTranslation();
  const { orders, refreshOrders } = useApp();
  const [loading, setLoading] = useState(false);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    refreshOrders()
      .catch((error) => Alert.alert(t("orders"), error.message))
      .finally(() => setLoading(false));
  }, [refreshOrders, t]);

  useFocusEffect(
    useCallback(() => {
      handleRefresh();
    }, [handleRefresh])
  );

  return (
    <Screen
      refreshControl={<RefreshControl tintColor="#21d4a2" refreshing={loading} onRefresh={handleRefresh} />}
    >
      <Text style={styles.title}>{t("orders")}</Text>
      {loading ? <ActivityIndicator color="#21d4a2" /> : null}
      {orders.length === 0 ? <Text style={styles.empty}>{t("noOrders")}</Text> : null}
      {orders.map((order) => (
        <View key={order.id} style={styles.card}>
          <Text style={styles.product}>{order.product_name}</Text>
          <Text style={styles.meta}>
            {t("supplier")}: {order.supplier}
          </Text>
          <Text style={styles.meta}>
            {t("status")}: {order.status}
          </Text>
          <Text style={styles.meta}>Quantity: {order.quantity}</Text>
          <Text style={styles.meta}>Delivery: {order.delivery_address}, {order.city}, {order.country}</Text>
          <Text style={styles.meta}>Unit: ${order.price_per_unit.toFixed(2)}</Text>
          <Text style={styles.meta}>Total: ${order.total_price.toFixed(2)}</Text>
          <Text style={styles.tracking}>
            {t("trackingNumber")}: {order.tracking_number}
          </Text>
        </View>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900"
  },
  empty: {
    color: "#9aa7bd",
    fontSize: 16
  },
  card: {
    backgroundColor: "#0f1728",
    borderColor: "#24304a",
    borderRadius: 22,
    borderWidth: 1,
    gap: 8,
    padding: 16
  },
  product: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800"
  },
  meta: {
    color: "#c5ccdc"
  },
  tracking: {
    color: "#21d4a2",
    fontWeight: "800"
  }
});
