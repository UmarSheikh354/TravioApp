import { router } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { AppSidebar } from "@/components/AppSidebar";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { ChatComposer } from "@/components/ChatComposer";
import { Screen } from "@/components/Screen";
import { TravioHeader, TravioMark } from "@/components/TravioMark";
import { useApp } from "@/context/AppContext";
import { colors, radii } from "@/lib/theme";

const suggestions = ["🔎 Find me a product", "⚖️ Compare prices", "⚡ Best deals today", "🌐 Search Alibaba"];

export default function HomeScreen() {
  const { orders } = useApp();
  const [request, setRequest] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeOrders = orders.filter((order) => !["delivered", "cancelled"].includes(order.status));
  const recentOrders = orders.slice(0, 3);

  function openChat(query?: string) {
    const trimmed = query?.trim();
    router.push(trimmed ? { pathname: "/chat", params: { q: trimmed } } : "/chat");
    setRequest("");
  }

  return (
    <Screen scroll={false} style={styles.screen}>
      <AppSidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} onNewChat={() => setRequest("")} />
      <TravioHeader
        onMenuPress={() => setSidebarOpen(true)}
        onTitlePress={() => setShowMenu((value) => !value)}
        onEditPress={() => router.push("/chat")}
      />
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
          <View style={styles.emptyState}>
            <TravioMark size={64} />
            <Text style={styles.emptyTitle}>How can I help you shop today?</Text>
            <View style={styles.suggestionGrid}>
              {suggestions.map((suggestion) => (
                <AnimatedPressable key={suggestion} style={styles.suggestionChip} onPress={() => openChat(suggestion)}>
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </AnimatedPressable>
              ))}
            </View>
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
      <ChatComposer
        value={request}
        onChangeText={setRequest}
        placeholder="Search for any product..."
        disabled={!request.trim()}
        onAttach={() => Alert.alert("Add to search", "Camera, image upload, and file upload are ready for native builds.")}
        onVoice={() => router.push("/voice-listening")}
        onSend={() => openChat(request)}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "space-between"
  },
  canvas: {
    alignItems: "center",
    backgroundColor: colors.chat,
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: 1,
    flex: 1,
    justifyContent: "flex-end",
    marginVertical: 14,
    paddingBottom: 16
  },
  emptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    gap: 18,
    width: "100%"
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "400",
    marginTop: 8
  },
  suggestionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    justifyContent: "center",
    marginTop: 12,
    paddingHorizontal: 12
  },
  suggestionChip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#CCCCCC",
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 40,
    paddingHorizontal: 16,
    paddingVertical: 10
  },
  suggestionText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: "600"
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
});
