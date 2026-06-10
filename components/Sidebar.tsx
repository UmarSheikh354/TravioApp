import { Feather } from "@expo/vector-icons";
import { useEffect } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PressableScale } from "@/components/PressableScale";
import { useApp } from "@/context/AppContext";
import { colors, radius, spacing } from "@/lib/theme";
import type { Chat } from "@/types/travio";

const SIDEBAR_WIDTH = 280;

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  chats: Chat[];
  searchValue: string;
  onSearchChange: (value: string) => void;
  onNewChat: () => void;
  onSelectChat: (chat: Chat) => void;
  onOpenSettings: () => void;
  onOpenWishlist: () => void;
}

function groupChats(chats: Chat[]) {
  const today: Chat[] = [];
  const yesterday: Chat[] = [];
  const previous: Chat[] = [];
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 86400000);

  chats.forEach((chat) => {
    const updated = new Date(chat.updated_at);
    if (updated >= startOfToday) {
      today.push(chat);
    } else if (updated >= startOfYesterday) {
      yesterday.push(chat);
    } else {
      previous.push(chat);
    }
  });

  return { today, yesterday, previous };
}

function ChatGroup({
  title,
  chats,
  onSelectChat,
}: {
  title: string;
  chats: Chat[];
  onSelectChat: (chat: Chat) => void;
}) {
  if (chats.length === 0) {
    return null;
  }
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      {chats.map((chat) => (
        <PressableScale
          key={chat.id}
          style={styles.chatItem}
          onPress={() => onSelectChat(chat)}
        >
          <Feather name="message-square" size={16} color={colors.textSecondary} />
          <Text style={styles.chatTitle} numberOfLines={1}>
            {chat.title}
          </Text>
        </PressableScale>
      ))}
    </View>
  );
}

export function Sidebar({
  visible,
  onClose,
  chats,
  searchValue,
  onSearchChange,
  onNewChat,
  onSelectChat,
  onOpenSettings,
  onOpenWishlist,
}: SidebarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { user, savedProducts, signOut } = useApp();
  const translateX = useSharedValue(-SIDEBAR_WIDTH);
  const opacity = useSharedValue(0);

  useEffect(() => {
    translateX.value = withTiming(visible ? 0 : -SIDEBAR_WIDTH, { duration: 300 });
    opacity.value = withTiming(visible ? 1 : 0, { duration: 300 });
  }, [visible, translateX, opacity]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const grouped = groupChats(chats.filter((chat) => !chat.is_archived));

  if (!visible && translateX.value === -SIDEBAR_WIDTH) {
    return null;
  }

  return (
    <View style={[StyleSheet.absoluteFill, styles.overlay]} pointerEvents={visible ? "auto" : "none"}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[
          styles.panel,
          { width: Math.min(SIDEBAR_WIDTH, width * 0.85), paddingTop: insets.top + spacing.md },
          panelStyle,
        ]}
      >
        <PressableScale style={styles.newChat} onPress={onNewChat}>
          <Feather name="plus" size={18} color={colors.white} />
          <Text style={styles.newChatText}>New Chat</Text>
        </PressableScale>

        <View style={styles.searchBar}>
          <Feather name="search" size={16} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder="Search chats"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <ChatGroup title="Today" chats={grouped.today} onSelectChat={onSelectChat} />
          <ChatGroup title="Yesterday" chats={grouped.yesterday} onSelectChat={onSelectChat} />
          <ChatGroup title="Previous" chats={grouped.previous} onSelectChat={onSelectChat} />
          {chats.length === 0 && (
            <Text style={styles.empty}>No chats yet. Start a new conversation.</Text>
          )}

          <PressableScale style={styles.savedRow} onPress={onOpenWishlist}>
            <Feather name="heart" size={16} color={colors.textPrimary} />
            <Text style={styles.savedText}>Saved Products</Text>
            <Text style={styles.savedCount}>{savedProducts.length}</Text>
          </PressableScale>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <PressableScale style={styles.footerRow} onPress={onOpenSettings}>
            <Feather name="settings" size={18} color={colors.textPrimary} />
            <Text style={styles.footerText}>Settings</Text>
          </PressableScale>

          <View style={styles.userRow}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitial}>
                {(user?.full_name ?? user?.email ?? "T").charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.full_name ?? user?.email ?? "Travio User"}
            </Text>
            <PressableScale onPress={signOut} hitSlop={8} accessibilityLabel="Log out">
              <Feather name="log-out" size={18} color={colors.textSecondary} />
            </PressableScale>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    zIndex: 100,
  },
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  panel: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.sidebar,
    paddingHorizontal: spacing.md,
  },
  newChat: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.textPrimary,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  newChatText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginTop: spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  scroll: {
    flex: 1,
    marginTop: spacing.md,
  },
  group: {
    marginBottom: spacing.lg,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: spacing.sm,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  chatTitle: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
  empty: {
    fontSize: 13,
    color: colors.textSecondary,
    marginVertical: spacing.lg,
  },
  savedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  savedText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  savedCount: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  footerText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "500",
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  userInitial: {
    color: colors.white,
    fontWeight: "700",
  },
  userName: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
  },
});
