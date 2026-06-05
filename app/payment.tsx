import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
import { env, isConfigured } from "@/lib/env";
import { notifyOrderUpdate } from "@/services/notifications";
import { useTravioPayments } from "@/services/payments";

export default function PaymentScreen() {
  const { t } = useTranslation();
  const { orderDraft, completeOrder } = useApp();
  const { pay } = useTravioPayments();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderDraft) {
      router.replace("/chat");
    }
  }, [orderDraft]);

  async function handlePay() {
    if (!orderDraft) {
      return;
    }

    try {
      setLoading(true);
      await pay(orderDraft);
      const order = await completeOrder(orderDraft);
      await notifyOrderUpdate(order);
      router.replace({ pathname: "/order-success", params: { tracking: order.tracking_number } });
    } catch (error) {
      Alert.alert(t("payment"), error instanceof Error ? error.message : "Payment failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!orderDraft) {
    return null;
  }

  const isLiveStripe = isConfigured(env.stripePublishableKey) && isConfigured(env.paymentIntentEndpoint);
  const total = orderDraft.product.total_price * orderDraft.quantity;

  return (
    <Screen style={styles.screen}>
      <Text style={styles.title}>{t("payment")}</Text>
      <View style={styles.card}>
        <Text style={styles.product}>{orderDraft.product.name}</Text>
        <Text style={styles.meta}>Quantity: {orderDraft.quantity}</Text>
        <Text style={styles.meta}>
          {t("supplier")}: {orderDraft.product.supplier}
        </Text>
        <Text style={styles.total}>${total.toFixed(2)}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Payment methods</Text>
        <Text style={styles.meta}>Credit/debit card, Google Pay, and Apple Pay through Stripe PaymentSheet.</Text>
        {!isLiveStripe ? (
          <Text style={styles.demo}>
            Demo payment mode is active because Stripe publishable key or PaymentIntent endpoint is a placeholder.
          </Text>
        ) : null}
      </View>
      <PrimaryButton title={t("payNow")} loading={loading} onPress={handlePay} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center"
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900"
  },
  card: {
    backgroundColor: "#0f1728",
    borderColor: "#24304a",
    borderRadius: 22,
    borderWidth: 1,
    gap: 10,
    padding: 16
  },
  product: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900"
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800"
  },
  meta: {
    color: "#c5ccdc",
    lineHeight: 22
  },
  total: {
    color: "#21d4a2",
    fontSize: 28,
    fontWeight: "900"
  },
  demo: {
    color: "#ffd166",
    lineHeight: 22
  }
});
