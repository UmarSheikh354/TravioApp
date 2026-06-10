import { Feather } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";
import { PressableScale } from "@/components/PressableScale";
import { colors, radius, spacing } from "@/lib/theme";

interface ChatInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onMic: () => void;
  onPlus?: () => void;
  disabled?: boolean;
}

export function ChatInputBar({
  value,
  onChangeText,
  onSend,
  onMic,
  onPlus,
  disabled,
}: ChatInputBarProps) {
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <View style={styles.container}>
      <PressableScale style={styles.iconButton} onPress={onPlus} accessibilityLabel="Add attachment">
        <Feather name="plus" size={22} color={colors.textSecondary} />
      </PressableScale>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder="Ask Travio Anything..."
        placeholderTextColor={colors.textSecondary}
        multiline
        onSubmitEditing={() => {
          if (canSend) onSend();
        }}
      />

      {canSend ? (
        <PressableScale
          style={styles.sendButton}
          onPress={onSend}
          accessibilityLabel="Send message"
        >
          <Feather name="arrow-up" size={20} color={colors.white} />
        </PressableScale>
      ) : (
        <PressableScale
          style={styles.iconButton}
          onPress={onMic}
          accessibilityLabel="Voice input"
        >
          <Feather name="mic" size={22} color={colors.textSecondary} />
        </PressableScale>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.textPrimary,
    maxHeight: 120,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.textPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
});
