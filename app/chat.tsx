import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useTranslation } from "react-i18next";
import { LoadingDots } from "@/components/LoadingDots";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProductCard } from "@/components/ProductCard";
import { Screen } from "@/components/Screen";
import { TravioHeader } from "@/components/TravioMark";
import { useApp } from "@/context/AppContext";
import { searchTravioProducts } from "@/services/search";
import type { ChatMessage, ProductOption } from "@/types/travio";
import { colors, radii } from "@/lib/theme";

const SEARCH_HISTORY_KEY = "travio.searchHistory";

export default function AIChatScreen() {
  const { t } = useTranslation();
  const params = useLocalSearchParams<{ q?: string }>();
  const { selectProduct } = useApp();
  const initialQuery = typeof params.q === "string" ? params.q : "";
  const ranInitialQuery = useRef(false);
  const [input, setInput] = useState(initialQuery);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Tell me what product you want. I will compare Alibaba, Amazon, and Temu.",
      createdAt: new Date().toISOString()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [lastQuery, setLastQuery] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

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
      <TravioHeader />
      {messages.map((message) => (
        <View key={message.id} style={[styles.message, message.role === "user" ? styles.userMessage : styles.aiMessage]}>
          <Text style={styles.messageRole}>{message.role === "user" ? "You" : "TRAVIO"}</Text>
          <Text style={[styles.messageText, message.role === "user" && styles.userMessageText]}>{message.content}</Text>
          {message.products?.map((product) => (
            <ProductCard key={`${product.supplier}-${product.name}`} product={product} onConfirm={confirm} />
          ))}
        </View>
      ))}

      {loading ? (
        <View style={[styles.message, styles.aiMessage]}>
          <Text style={styles.messageRole}>TRAVIO</Text>
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
        <TextInput
          placeholder="Can you tell me anything, right?"
          placeholderTextColor={colors.dim}
          value={input}
          onChangeText={setInput}
          multiline
          style={styles.input}
        />
        <Pressable style={[styles.sendButton, (!input.trim() || loading) && styles.disabledSend]} onPress={handleSearch} disabled={!input.trim() || loading}>
          <Text style={styles.sendText}>{loading ? "..." : ">"}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: 16
  },
  message: {
    borderRadius: radii.card,
    gap: 12,
    padding: 14,
    width: "92%"
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: colors.accent
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: colors.panel
  },
  messageRole: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  messageText: {
    color: colors.text,
    fontSize: 13,
    lineHeight: 20
  },
  userMessageText: {
    color: colors.accentText
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
    alignItems: "center",
    backgroundColor: colors.accent,
    borderRadius: 24,
    flexDirection: "row",
    gap: 8,
    marginTop: "auto",
    minHeight: 58,
    paddingHorizontal: 14,
    paddingVertical: 8
  },
  input: {
    color: colors.accentText,
    flex: 1,
    fontSize: 13,
    maxHeight: 100,
    minHeight: 38
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  disabledSend: {
    opacity: 0.65
  },
  sendText: {
    color: colors.accent,
    fontWeight: "900"
  }
});
