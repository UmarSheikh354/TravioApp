import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { ChatComposer } from "@/components/ChatComposer";
import { LoadingDots } from "@/components/LoadingDots";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProductCard } from "@/components/ProductCard";
import { Screen } from "@/components/Screen";
import { TravioHeader } from "@/components/TravioMark";
import { useApp } from "@/context/AppContext";
import { searchTravioProducts } from "@/services/search";
import type { ChatMessage, ProductOption } from "@/types/travio";
import { colors } from "@/lib/theme";

const SEARCH_HISTORY_KEY = "travio.searchHistory";

export default function AIChatScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ q?: string }>();
  const { selectProduct } = useApp();
  const initialQuery = typeof params.q === "string" ? params.q : "";
  const ranInitialQuery = useRef(false);
  const [input, setInput] = useState(initialQuery);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [lastQuery, setLastQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState(false);

  const rememberSearch = useCallback((query: string) => {
    setSearchHistory((current) => {
      const next = [query, ...current.filter((item) => item.toLowerCase() !== query.toLowerCase())].slice(0, 6);
      AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  }, []);

  const normalizeErrors = useCallback((nextErrors: string[]) => {
    const offline = nextErrors.some((message) => /network|fetch|offline/i.test(message));
    return offline
      ? ["You appear to be offline. Check your internet connection and retry.", ...nextErrors]
      : nextErrors;
  }, []);

  const runSearch = useCallback(async (rawQuery: string) => {
    const query = rawQuery.trim();
    if (!query) {
      return;
    }

    setInput("");
    setLoading(true);
    setErrors([]);
    setLastQuery(query);
    rememberSearch(query);
    setMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: query,
        createdAt: new Date().toISOString()
      }
    ]);

    try {
      const result = await searchTravioProducts(query);
      setErrors(normalizeErrors(result.errors));
      setMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: "Here are 3 supplier options for your request.",
          products: result.products,
          createdAt: new Date().toISOString()
        }
      ]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Search failed.";
      setErrors(normalizeErrors([message]));
      Alert.alert(t("chat"), message);
    } finally {
      setLoading(false);
    }
  }, [normalizeErrors, rememberSearch, t]);

  useEffect(() => {
    AsyncStorage.getItem(SEARCH_HISTORY_KEY)
      .then((raw) => setSearchHistory(raw ? (JSON.parse(raw) as string[]) : []))
      .catch(() => setSearchHistory([]));
  }, []);

  useEffect(() => {
    if (!initialQuery || ranInitialQuery.current) {
      return;
    }

    ranInitialQuery.current = true;
    void runSearch(initialQuery);
  }, [initialQuery, runSearch]);

  async function handleSearch() {
    await runSearch(input);
  }

  function confirm(product: ProductOption) {
    selectProduct(product);
    router.push("/order-confirmation");
  }

  return (
    <Screen style={styles.screen}>
      <TravioHeader
        onMenuPress={() => router.push("/(tabs)/profile")}
        onTitlePress={() => setShowMenu((value) => !value)}
        onEditPress={() => setMessages([])}
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
      <View style={styles.timeline}>
        {messages.map((message) => (
          <View key={message.id} style={[styles.message, message.role === "user" && styles.userMessage]}>
            <View style={[styles.messageHeader, message.role === "user" && styles.userMessageHeader]}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{message.role === "user" ? "•" : "◉"}</Text>
              </View>
              <Text style={styles.messageRole}>{message.role === "user" ? "You" : "Travio"}</Text>
            </View>
            <Text style={[styles.messageText, message.role === "user" && styles.userText]}>{message.content}</Text>
            {message.products?.map((product) => (
              <ProductCard key={`${product.supplier}-${product.name}`} product={product} onConfirm={confirm} />
            ))}
          </View>
        ))}
      </View>

      {loading ? (
        <View style={styles.message}>
          <View style={styles.messageHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>◉</Text>
            </View>
            <Text style={styles.messageRole}>Travio</Text>
          </View>
          <View style={styles.loadingRow}>
            <Text style={styles.messageText}>{t("searching")}</Text>
            <LoadingDots />
          </View>
        </View>
      ) : null}

      {errors.length > 0 ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Search issue</Text>
          {errors.map((error) => (
            <Text key={error} style={styles.errorText}>
              - {error}
            </Text>
          ))}
          {lastQuery ? <PrimaryButton title="Retry search" variant="secondary" onPress={() => runSearch(lastQuery)} /> : null}
        </View>
      ) : null}

      {searchHistory.length > 0 ? (
        <View style={styles.historyBox}>
          <Text style={styles.errorTitle}>Search history</Text>
          <View style={styles.historyRow}>
            {searchHistory.map((item) => (
              <Pressable key={item} style={styles.historyPill} onPress={() => runSearch(item)}>
                <Text style={styles.historyText}>{item}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.inputRow}>
        <ChatComposer
          placeholder="Ask Travio Anything..."
          value={input}
          onChangeText={setInput}
          disabled={!input.trim() || loading}
          loading={loading}
          onSend={handleSearch}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: 16
  },
  timeline: {
    gap: 18,
    paddingTop: 14
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
  message: {
    alignSelf: "flex-start",
    gap: 6,
    maxWidth: "92%"
  },
  userMessage: {
    alignSelf: "flex-end"
  },
  messageHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8
  },
  userMessageHeader: {
    flexDirection: "row-reverse"
  },
  avatar: {
    alignItems: "center",
    height: 18,
    justifyContent: "center",
    width: 18
  },
  avatarText: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "900"
  },
  messageRole: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "800"
  },
  messageText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
    paddingLeft: 26
  },
  userText: {
    color: colors.text,
    paddingLeft: 0,
    paddingRight: 26,
    textAlign: "right"
  },
  errorBox: {
    backgroundColor: colors.dangerPanel,
    borderColor: "#593638",
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    padding: 14
  },
  errorTitle: {
    color: colors.dangerText,
    fontWeight: "900"
  },
  errorText: {
    color: colors.dangerText,
    lineHeight: 20
  },
  loadingRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  historyBox: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    padding: 14
  },
  historyRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  historyPill: {
    backgroundColor: colors.control,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  historyText: {
    color: colors.muted,
    fontWeight: "700"
  },
  inputRow: {
    marginTop: "auto"
  }
});
