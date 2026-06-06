import { Pressable, StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native";
import { colors } from "@/lib/theme";

type Props = TextInputProps & {
  disabled?: boolean;
  loading?: boolean;
  onSend: () => void;
};

export function ChatComposer({ disabled, loading, onSend, style, ...props }: Props) {
  return (
    <View style={styles.composer}>
      <Pressable style={styles.plusButton}>
        <Text style={styles.plusText}>+</Text>
      </Pressable>
      <TextInput
        placeholder="Ask Travio Anything..."
        placeholderTextColor="#c8c8c8"
        style={[styles.input, style]}
        multiline
        {...props}
      />
      <Pressable style={[styles.sendButton, disabled && styles.disabled]} disabled={disabled} onPress={onSend}>
        <Text style={styles.sendText}>{loading ? "..." : "↑"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    flexDirection: "row",
    gap: 8,
    minHeight: 64,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  plusButton: {
    alignItems: "center",
    borderColor: "#d9d9d9",
    borderRadius: 14,
    borderWidth: 1,
    height: 28,
    justifyContent: "center",
    width: 28
  },
  plusText: {
    color: "#a9a9a9",
    fontSize: 18,
    fontWeight: "500"
  },
  input: {
    color: colors.accentText,
    flex: 1,
    fontSize: 13,
    maxHeight: 96,
    minHeight: 38
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    width: 32
  },
  disabled: {
    opacity: 0.5
  },
  sendText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900"
  }
});
