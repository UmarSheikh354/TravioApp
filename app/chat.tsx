import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { LoadingDots } from "@/components/LoadingDots";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProductCard } from "@/components/ProductCard";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { useApp } from "@/context/AppContext";
import { searchTravioProducts } from "@/services/search";
import type { ChatMessage, ProductOption } from "@/types/travio";

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
    <Screen>
      <Text style={styles.title}>{t("chat")}</Text>
      {messages.map((message) => (
        <View key={message.id} style={[styles.message, message.role === "user" ? styles.userMessage : styles.aiMessage]}>
          <Text style={styles.messageRole}>{message.role === "user" ? "You" : "Travio AI"}</Text>
          <Text style={styles.messageText}>{message.content}</Text>
          {message.products?.map((product) => (
            <ProductCard key={`${product.supplier}-${product.name}`} product={product} onConfirm={confirm} />
          ))}
        </View>
      ))}

      {loading ? (
        <View style={[styles.message, styles.aiMessage]}>
          <Text style={styles.messageRole}>Travio AI</Text>
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
        <View style={styles.inputWrap}>
          <TextField
            label={t("chatPlaceholder")}
            placeholder="e.g. 100 cotton tote bags under $2 each"
            value={input}
            onChangeText={setInput}
            multiline
          />
        </View>
        <PrimaryButton title={t("search")} loading={loading} disabled={!input.trim()} onPress={handleSearch} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900"
  },
  message: {
    borderRadius: 22,
    gap: 12,
    padding: 14
  },
  userMessage: {
    backgroundColor: "#173426"
  },
  aiMessage: {
    backgroundColor: "#0f1728"
  },
  messageRole: {
    color: "#21d4a2",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  messageText: {
    color: "#fff",
    lineHeight: 22
  },
  errorBox: {
    backgroundColor: "#321c1c",
    borderColor: "#794242",
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    padding: 14
  },
  errorTitle: {
    color: "#ffd6d6",
    fontWeight: "900"
  },
  errorText: {
    color: "#ffc7c7",
    lineHeight: 20
  },
  loadingRow: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  historyBox: {
    backgroundColor: "#101827",
    borderColor: "#24304a",
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
    backgroundColor: "#182033",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8
  },
  historyText: {
    color: "#d7deee",
    fontWeight: "700"
  },
  inputRow: {
    gap: 12
  },
  inputWrap: {
    flex: 1
  }
});
