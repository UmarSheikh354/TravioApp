import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { ScrollView, Share, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Logo } from "@/components/Logo";
import { PressableScale } from "@/components/PressableScale";
import { ProductCard } from "@/components/ProductCard";
import { colors, spacing } from "@/lib/theme";
import type { ChatMessage as ChatMessageType, Product } from "@/types/travio";

interface ChatMessageProps {
  message: ChatMessageType;
  isSaved: (productId: string) => boolean;
  onToggleSave: (product: Product) => void;
  onRegenerate?: () => void;
  onFeedback?: (feedback: "up" | "down") => void;
}

function ActionButton({
  icon,
  active,
  onPress,
  label,
}: {
  icon: keyof typeof Feather.glyphMap;
  active?: boolean;
  onPress: () => void;
  label: string;
}) {
  return (
    <PressableScale onPress={onPress} hitSlop={8} accessibilityLabel={label}>
      <Feather
        name={icon}
        size={18}
        color={active ? colors.accent : colors.iconMuted}
      />
    </PressableScale>
  );
}

export function ChatMessage({
  message,
  isSaved,
  onToggleSave,
  onRegenerate,
  onFeedback,
}: ChatMessageProps) {
  const isUser = message.role === "user";

  async function copy() {
    await Clipboard.setStringAsync(message.content);
  }

  async function share() {
    try {
      await Share.share({ message: message.content });
    } catch {
      // ignore share cancellation
    }
  }

  if (isUser) {
    return (
      <Animated.View
        entering={FadeInUp.duration(200)}
        style={[styles.row, styles.userRow]}
      >
        <Text style={styles.userText}>{message.content}</Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View entering={FadeInUp.duration(200)} style={styles.assistantRow}>
      <View style={styles.assistantHeader}>
        <View style={styles.avatar}>
          <Logo size={18} />
        </View>
        <Text style={styles.name}>Travio</Text>
      </View>

      {message.content.length > 0 && (
        <Text style={styles.assistantText}>{message.content}</Text>
      )}

      {message.products && message.products.length > 0 && (
        <View style={styles.products}>
          <Text style={styles.productsIntro}>
            Here are the best options I found for you:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.productScroll}
          >
            {message.products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                saved={isSaved(product.id)}
                onToggleSave={onToggleSave}
              />
            ))}
          </ScrollView>
          <Text style={styles.productsOutro}>
            Want me to compare or find something more specific?
          </Text>
        </View>
      )}

      {!message.streaming && (
        <View style={styles.actions}>
          <ActionButton icon="copy" onPress={copy} label="Copy" />
          <ActionButton
            icon="thumbs-up"
            active={message.feedback === "up"}
            onPress={() => onFeedback?.("up")}
            label="Good response"
          />
          <ActionButton
            icon="thumbs-down"
            active={message.feedback === "down"}
            onPress={() => onFeedback?.("down")}
            label="Bad response"
          />
          <ActionButton icon="share-2" onPress={share} label="Share" />
          {onRegenerate && (
            <ActionButton
              icon="refresh-cw"
              onPress={onRegenerate}
              label="Regenerate"
            />
          )}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: spacing.xl,
  },
  userRow: {
    alignItems: "flex-end",
  },
  userText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 18,
    maxWidth: "85%",
    overflow: "hidden",
  },
  assistantRow: {
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  assistantHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.textPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  assistantText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  products: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  productsIntro: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  productScroll: {
    paddingVertical: spacing.sm,
  },
  productsOutro: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: "italic",
  },
  actions: {
    flexDirection: "row",
    gap: spacing.lg,
    marginTop: spacing.xs,
  },
});
