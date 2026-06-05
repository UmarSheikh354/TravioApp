import { router } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProductCard } from "@/components/ProductCard";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { useApp } from "@/context/AppContext";
import { searchTravioProducts } from "@/services/search";
import type { ChatMessage, ProductOption } from "@/types/travio";

export default function AIChatScreen() {
  const { t } = useTranslation();
  const { selectProduct } = useApp();
  const [input, setInput] = useState("");
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

  async function handleSearch() {
    const query = input.trim();
    if (!query) {
      return;
    }

    setInput("");
    setLoading(true);
    setErrors([]);
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
      setErrors(result.errors);
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
      Alert.alert(t("chat"), error instanceof Error ? error.message : "Search failed.");
    } finally {
      setLoading(false);
    }
  }

  function confirm(product: ProductOption) {
    selectProduct(product);
    router.push("/order-confirmation");
  }

  return (
    <Screen>
      <LoadingOverlay visible={loading} message={t("searching")} />
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

      {errors.length > 0 ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>API setup notes</Text>
          {errors.map((error) => (
            <Text key={error} style={styles.errorText}>
              - {error}
            </Text>
          ))}
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
  inputRow: {
    gap: 12
  },
  inputWrap: {
    flex: 1
  }
});
