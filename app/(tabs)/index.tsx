import { Feather } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ChatInputBar } from "@/components/ChatInputBar";
import { ChatMessage } from "@/components/ChatMessage";
import { LoadingDots } from "@/components/LoadingDots";
import { Logo } from "@/components/Logo";
import { PressableScale } from "@/components/PressableScale";
import { SettingsSheet } from "@/components/SettingsSheet";
import { Sidebar } from "@/components/Sidebar";
import { SuggestionChip } from "@/components/SuggestionChip";
import { VoiceModal } from "@/components/VoiceModal";
import { useApp } from "@/context/AppContext";
import { useChat } from "@/hooks/useChat";
import { listChats, listMessages } from "@/lib/db";
import { colors, radius, spacing } from "@/lib/theme";
import type { Chat, ChatMessage as ChatMessageType } from "@/types/travio";

const SUGGESTIONS: { label: string; icon: keyof typeof Feather.glyphMap }[] = [
  { label: "Find me a product", icon: "search" },
  { label: "Compare prices", icon: "bar-chart-2" },
  { label: "Best deals today", icon: "tag" },
  { label: "Search Alibaba", icon: "globe" },
];

const MODELS = ["TRAVIO PLUS", "TRAVIO"];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const {
    user,
    preferences,
    isProductSaved,
    toggleSavedProduct,
  } = useApp();
  const { messages, loading, send, regenerate, updateFeedback, reset, setMessages } = useChat(
    user,
    preferences.hapticFeedback ?? true,
  );

  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [model, setModel] = useState(MODELS[1]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [search, setSearch] = useState("");
  const listRef = useRef<FlatList<ChatMessageType>>(null);

  const refreshChats = useCallback(async () => {
    if (user) {
      setChats(await listChats(user.id));
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      refreshChats();
    }, [refreshChats]),
  );

  async function handleSend(text?: string) {
    const value = text ?? input;
    if (!value.trim()) {
      return;
    }
    setInput("");
    await send(value);
    refreshChats();
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  }

  function newChat() {
    reset();
    setInput("");
    setSidebarOpen(false);
  }

  async function openChat(chat: Chat) {
    const history = await listMessages(chat.id);
    setMessages(history);
    setSidebarOpen(false);
  }

  const showEmpty = messages.length === 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <PressableScale
          onPress={() => setSidebarOpen(true)}
          hitSlop={8}
          accessibilityLabel="Open menu"
        >
          <Feather name="menu" size={24} color={colors.textPrimary} />
        </PressableScale>

        <PressableScale style={styles.brandWrapper} onPress={() => setModelOpen((v) => !v)}>
          <Logo size={24} />
          <Text style={styles.brand}>TRAVIO</Text>
          <Feather name="chevron-down" size={16} color={colors.textPrimary} />
        </PressableScale>

        <PressableScale onPress={newChat} hitSlop={8} accessibilityLabel="New chat">
          <Feather name="edit" size={24} color={colors.textPrimary} />
        </PressableScale>
      </View>

      {modelOpen && (
        <View style={styles.modelMenu}>
          {MODELS.map((item) => (
            <PressableScale
              key={item}
              style={styles.modelItem}
              onPress={() => {
                setModel(item);
                setModelOpen(false);
              }}
            >
              <Feather
                name={item === model ? "check" : item === "TRAVIO PLUS" ? "zap" : "star"}
                size={16}
                color={colors.textPrimary}
              />
              <Text style={styles.modelText}>{item}</Text>
            </PressableScale>
          ))}
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={insets.top + 8}
      >
        {showEmpty ? (
          <View style={styles.empty}>
            <Logo size={64} />
            <Text style={styles.emptyTitle}>How can I help you shop today?</Text>
            <View style={styles.chips}>
              {SUGGESTIONS.map((suggestion) => (
                <SuggestionChip
                  key={suggestion.label}
                  label={suggestion.label}
                  icon={suggestion.icon}
                  onPress={() => handleSend(suggestion.label)}
                />
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messages}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            renderItem={({ item, index }) => (
              <ChatMessage
                message={item}
                isSaved={isProductSaved}
                onToggleSave={toggleSavedProduct}
                onFeedback={(feedback) => updateFeedback(item.id, feedback)}
                onRegenerate={
                  item.role === "assistant" && index === messages.length - 1
                    ? regenerate
                    : undefined
                }
              />
            )}
            ListFooterComponent={loading ? <LoadingDots /> : null}
          />
        )}

        <View style={[styles.inputWrapper, { paddingBottom: insets.bottom + spacing.sm }]}>
          <ChatInputBar
            value={input}
            onChangeText={setInput}
            onSend={() => handleSend()}
            onMic={() => setVoiceOpen(true)}
            onPlus={() => router.push("/(tabs)/search")}
            disabled={loading}
          />
        </View>
      </KeyboardAvoidingView>

      <Sidebar
        visible={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        chats={chats}
        searchValue={search}
        onSearchChange={setSearch}
        onNewChat={newChat}
        onSelectChat={openChat}
        onOpenSettings={() => {
          setSidebarOpen(false);
          setSettingsOpen(true);
        }}
        onOpenWishlist={() => {
          setSidebarOpen(false);
          router.push("/(tabs)/wishlist");
        }}
      />

      <SettingsSheet visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <VoiceModal visible={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
  },
  brandWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  brand: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  modelMenu: {
    position: "absolute",
    top: 56 + 8,
    alignSelf: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.xs,
    width: 220,
    zIndex: 50,
    shadowColor: colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  modelItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  modelText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    gap: spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    color: colors.textSecondary,
    textAlign: "center",
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  messages: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  inputWrapper: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
});
