import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Screen } from "@/components/Screen";
import { TravioHeader } from "@/components/TravioMark";
import { useApp } from "@/context/AppContext";
import { colors, radii } from "@/lib/theme";

const categories = ["Electronics", "Fashion", "Home", "Beauty", "Sports", "Business"];

export default function HomeScreen() {
  const { t } = useTranslation();
  const { orders } = useApp();
  const [request, setRequest] = useState("");
  const activeOrders = orders.filter((order) => !["delivered", "cancelled"].includes(order.status));
  const recentOrders = orders.slice(0, 3);

  function openChat(query?: string) {
    const trimmed = query?.trim();
    router.push(trimmed ? { pathname: "/chat", params: { q: trimmed } } : "/chat");
    setRequest("");
  }

  return (
    <Screen scroll={false} style={styles.screen}>
      <TravioHeader />
      <View style={styles.canvas}>
        {activeOrders.length > 0 ? (
          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>{activeOrders.length} active order{activeOrders.length === 1 ? "" : "s"}</Text>
            {recentOrders.map((order) => (
              <Text key={order.id} style={styles.statusText}>{order.product_name} - {order.status}</Text>
            ))}
          </View>
        ) : null}
      </View>
      <View style={styles.quickRow}>
        {categories.slice(0, 3).map((category) => (
          <Pressable key={category} style={styles.categoryPill} onPress={() => openChat(category)}>
            <Text style={styles.categoryText}>{category}</Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.chatBar}>
        <TextInput
          placeholder={t("chatPlaceholder")}
          placeholderTextColor={colors.dim}
          value={request}
          onChangeText={setRequest}
          style={styles.chatInput}
        />
        <Pressable style={styles.sendButton} onPress={() => openChat(request)} disabled={!request.trim()}>
          <Text style={styles.sendText}>{">"}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "space-between"
  },
  canvas: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 16
  },
  statusCard: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: radii.card,
    borderWidth: 1,
    gap: 8,
    padding: 16
  },
  statusTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900"
  },
  statusText: {
    color: colors.muted,
    fontSize: 11
  },
  chatBar: {
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 24,
    flexDirection: "row",
    gap: 8,
    minHeight: 58,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  chatInput: {
    color: colors.accentText,
    flex: 1,
    fontSize: 13,
    minHeight: 40
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  sendText: {
    color: colors.accent,
    fontWeight: "900"
  },
  quickRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center"
  },
  categoryPill: {
    backgroundColor: colors.control,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7
  },
  categoryText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700"
  }
});
