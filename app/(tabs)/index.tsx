import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { ChatComposer } from "@/components/ChatComposer";
import { Screen } from "@/components/Screen";
import { TravioHeader, TravioMark } from "@/components/TravioMark";
import { useApp } from "@/context/AppContext";
import { colors, radii } from "@/lib/theme";

const categories = ["Electronics", "Fashion", "Home", "Beauty", "Sports", "Business"];

export default function HomeScreen() {
  const { t } = useTranslation();
  const { orders } = useApp();
  const [request, setRequest] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const activeOrders = orders.filter((order) => !["delivered", "cancelled"].includes(order.status));
  const recentOrders = orders.slice(0, 3);

  function openChat(query?: string) {
    const trimmed = query?.trim();
    router.push(trimmed ? { pathname: "/chat", params: { q: trimmed } } : "/chat");
    setRequest("");
  }

  return (
    <Screen scroll={false} style={styles.screen}>
      <TravioHeader onMenuPress={() => setShowMenu((value) => !value)} onEditPress={() => router.push("/chat")} />
      {showMenu ? (
        <View style={styles.planMenu}>
          <Pressable style={styles.planRow} onPress={() => router.push("/(tabs)/profile")}>
            <Text style={styles.planText}>TRAVIO PLUS</Text>
            <Text style={styles.planIcon}>ϟ</Text>
          </Pressable>
          <Pressable style={styles.planRow} onPress={() => setShowMenu(false)}>
            <Text style={styles.planText}>✓ TRAVIO</Text>
            <Text style={styles.planIcon}>✦</Text>
          </Pressable>
        </View>
      ) : null}
      <View style={styles.canvas}>
        {activeOrders.length === 0 ? (
          <View style={styles.emptyLogo}>
            <TravioMark size={44} />
          </View>
        ) : (
          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>{activeOrders.length} active order{activeOrders.length === 1 ? "" : "s"}</Text>
            {recentOrders.map((order) => (
              <Text key={order.id} style={styles.statusText}>{order.product_name} - {order.status}</Text>
            ))}
          </View>
        )}
      </View>
      <View style={styles.quickRow}>
        {categories.slice(0, 3).map((category) => (
          <Pressable key={category} style={styles.categoryPill} onPress={() => openChat(category)}>
            <Text style={styles.categoryText}>{category}</Text>
          </Pressable>
        ))}
      </View>
      <ChatComposer value={request} onChangeText={setRequest} placeholder={t("chatPlaceholder")} disabled={!request.trim()} onSend={() => openChat(request)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "space-between"
  },
  canvas: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 16
  },
  emptyLogo: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    width: "100%"
  },
  planMenu: {
    alignSelf: "center",
    backgroundColor: "#9b9b9f",
    borderRadius: 9,
    marginTop: 10,
    overflow: "hidden",
    width: 190
  },
  planRow: {
    alignItems: "center",
    borderBottomColor: "rgba(0,0,0,0.16)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 38,
    paddingHorizontal: 16
  },
  planText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700"
  },
  planIcon: {
    color: colors.text,
    fontSize: 20
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
