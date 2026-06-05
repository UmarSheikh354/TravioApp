import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";

const categories = ["Electronics", "Fashion", "Home", "Beauty", "Sports", "Business"];

export default function HomeScreen() {
  const { t } = useTranslation();
  const { user, orders } = useApp();
  const [request, setRequest] = useState("");
  const activeOrders = orders.filter((order) => !["delivered", "cancelled"].includes(order.status));
  const recentOrders = orders.slice(0, 3);

  function openChat(query?: string) {
    const trimmed = query?.trim();
    router.push(trimmed ? { pathname: "/chat", params: { q: trimmed } } : "/chat");
    setRequest("");
  }

  return (
    <Screen>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>{t("appName")}</Text>
        <Text style={styles.title}>Welcome{user?.name ? `, ${user.name}` : ""}</Text>
        <Text style={styles.subtitle}>Find products globally, compare suppliers, and pay securely.</Text>
        <View style={styles.chatBar}>
          <TextInput
            placeholder={t("chatPlaceholder")}
            placeholderTextColor="#6f7a91"
            value={request}
            onChangeText={setRequest}
            style={styles.chatInput}
          />
          <Pressable style={styles.sendButton} onPress={() => openChat(request)} disabled={!request.trim()}>
            <Text style={styles.sendText}>Ask</Text>
          </Pressable>
        </View>
        <PrimaryButton title={t("startChat")} onPress={() => openChat()} />
      </View>

      <View style={styles.section}>
        <Text style={styles.cardTitle}>Categories</Text>
        <View style={styles.categoryGrid}>
          {categories.map((category) => (
            <Pressable key={category} style={styles.categoryPill} onPress={() => openChat(category)}>
              <Text style={styles.categoryText}>{category}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Order status tracking</Text>
        <Text style={styles.cardText}>
          {activeOrders.length > 0
            ? `${activeOrders.length} active order${activeOrders.length === 1 ? "" : "s"} in progress.`
            : "No active orders. Start a chat to create one."}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.cardTitle}>Recent orders</Text>
        {recentOrders.length === 0 ? (
          <Text style={styles.cardText}>Your latest Travio orders will appear here.</Text>
        ) : (
          recentOrders.map((order) => (
            <View key={order.id} style={styles.recentOrder}>
              <Text style={styles.recentProduct}>{order.product_name}</Text>
              <Text style={styles.cardText}>{order.status} - ${order.total_price.toFixed(2)}</Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.steps}>
        {["Chat with Travio AI", "Choose a product card", "Confirm details", "Pay and track"].map((step, index) => (
          <View key={step} style={styles.step}>
            <Text style={styles.stepNumber}>{index + 1}</Text>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: "#0f1728",
    borderColor: "#24304a",
    borderRadius: 28,
    borderWidth: 1,
    gap: 14,
    padding: 22
  },
  eyebrow: {
    color: "#21d4a2",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase"
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900"
  },
  subtitle: {
    color: "#c5ccdc",
    fontSize: 16,
    lineHeight: 24
  },
  card: {
    backgroundColor: "#101827",
    borderRadius: 22,
    gap: 8,
    padding: 18
  },
  cardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800"
  },
  cardText: {
    color: "#9aa7bd",
    lineHeight: 21
  },
  chatBar: {
    alignItems: "center",
    backgroundColor: "#05070d",
    borderColor: "#24304a",
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: "row",
    gap: 10,
    padding: 8
  },
  chatInput: {
    color: "#fff",
    flex: 1,
    minHeight: 42,
    paddingHorizontal: 10
  },
  sendButton: {
    backgroundColor: "#21d4a2",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  sendText: {
    color: "#05070d",
    fontWeight: "900"
  },
  section: {
    backgroundColor: "#101827",
    borderRadius: 22,
    gap: 12,
    padding: 18
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  categoryPill: {
    backgroundColor: "#182033",
    borderColor: "#303a55",
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  categoryText: {
    color: "#d7deee",
    fontWeight: "700"
  },
  recentOrder: {
    backgroundColor: "#0f1728",
    borderRadius: 16,
    gap: 4,
    padding: 12
  },
  recentProduct: {
    color: "#fff",
    fontWeight: "800"
  },
  steps: {
    gap: 12
  },
  step: {
    alignItems: "center",
    backgroundColor: "#0f1728",
    borderRadius: 18,
    flexDirection: "row",
    gap: 12,
    padding: 14
  },
  stepNumber: {
    backgroundColor: "#21d4a2",
    borderRadius: 999,
    color: "#05070d",
    fontWeight: "900",
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 6
  },
  stepText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  }
});
