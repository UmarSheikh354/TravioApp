import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, Share, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { AppSidebar } from "@/components/AppSidebar";
import { ChatComposer } from "@/components/ChatComposer";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProductCard } from "@/components/ProductCard";
import { Screen } from "@/components/Screen";
import { TravioHeader, TravioMark } from "@/components/TravioMark";
import { TypingIndicator } from "@/components/TypingIndicator";
import { useApp } from "@/context/AppContext";
import { searchTravioProducts } from "@/services/search";
import type { ChatMessage, ProductOption } from "@/types/travio";
import { colors } from "@/lib/theme";

const SEARCH_HISTORY_KEY = "travio.searchHistory";
const STREAM_RESPONSE = "Here are the best options I found for you.";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      const assistantId = `assistant-${Date.now()}`;
      setLoading(false);
      setMessages((current) => [
        ...current,
        {
          id: assistantId,
          role: "assistant",
          content: "",
          createdAt: new Date().toISOString()
        }
      ]);
      const words = STREAM_RESPONSE.split(" ");
      for (let wordIndex = 0; wordIndex < words.length; wordIndex += 1) {
        await wait(55);
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantId
              ? {
                  ...message,
                  content: words.slice(0, wordIndex + 1).join(" ")
                }
              : message
          )
        );
      }
      setMessages((current) =>
        current.map((message) => (message.id === assistantId ? { ...message, products: result.products } : message))
      );
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
      <AppSidebar visible={sidebarOpen} onClose={() => setSidebarOpen(false)} onNewChat={() => setMessages([])} />
      <TravioHeader
        onMenuPress={() => setSidebarOpen(true)}
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
          <Pressable
            key={message.id}
            style={[styles.message, message.role === "user" && styles.userMessage]}
            onLongPress={() => Alert.alert("Copied", message.content)}
          >
            <View style={[styles.messageHeader, message.role === "user" && styles.userMessageHeader]}>
              {message.role === "user" ? (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>•</Text>
                </View>
              ) : (
                <TravioMark size={24} />
              )}
              <Text style={styles.messageRole}>{message.role === "user" ? "You" : "Travio"}</Text>
            </View>
            <Text style={[styles.messageText, message.role === "user" && styles.userText]}>{message.content}</Text>
            {message.products?.map((product) => (
              <ProductCard key={`${product.supplier}-${product.name}`} product={product} onConfirm={confirm} />
            ))}
            {message.role === "assistant" ? (
              <View style={styles.feedbackRow}>
                <Pressable onPress={() => Alert.alert("Feedback", "Thanks for the thumbs up.")}>
                  <Text style={styles.feedbackText}>👍</Text>
                </Pressable>
                <Pressable onPress={() => Alert.alert("Feedback", "Thanks, we will improve this response.")}>
                  <Text style={styles.feedbackText}>👎</Text>
                </Pressable>
                <Pressable onPress={() => Share.share({ message: message.content })}>
                  <Text style={styles.feedbackText}>Share</Text>
                </Pressable>
                <Pressable onPress={() => runSearch(lastQuery || message.content)}>
                  <Text style={styles.feedbackText}>Retry</Text>
                </Pressable>
              </View>
            ) : null}
          </Pressable>
        ))}
      </View>

      {loading ? (
        <TypingIndicator />
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
          disabled={!input.trim() && !loading}
          loading={loading}
          onAttach={() => Alert.alert("Add to search", "Camera, image upload, and file upload are ready for native builds.")}
          onVoice={() => router.push("/voice-listening")}
          onSend={() => (loading ? setLoading(false) : handleSearch())}
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
    backgroundColor: colors.chat,
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: 1,
    flex: 1,
    gap: 24,
    marginTop: 14,
    padding: 16
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
    fontSize: 16,
    lineHeight: 24,
    paddingLeft: 36
  },
  userText: {
    color: colors.text,
    paddingLeft: 0,
    paddingRight: 36,
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
  },
  feedbackRow: {
    flexDirection: "row",
    gap: 14,
    paddingLeft: 26,
    paddingTop: 4
  },
  feedbackText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700"
  }
});
