import { Pressable, StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native";
import { colors } from "@/lib/theme";

type Props = TextInputProps & {
  disabled?: boolean;
  loading?: boolean;
  onAttach?: () => void;
  onVoice?: () => void;
  onSend: () => void;
};

export function ChatComposer({ disabled, loading, onAttach, onSend, onVoice, style, ...props }: Props) {
  return (
    <View style={styles.composer}>
      <Pressable style={styles.plusButton} onPress={onAttach}>
        <Text style={styles.plusText}>+</Text>
      </Pressable>
      <TextInput
        placeholder="Search for any product..."
        placeholderTextColor="#8C8C8C"
        style={[styles.input, style]}
        multiline
        {...props}
      />
      <Pressable style={styles.micButton} onPress={onVoice}>
        <Text style={styles.micText}>◉</Text>
      </Pressable>
      <Pressable style={[styles.sendButton, disabled && styles.disabled]} disabled={disabled} onPress={onSend}>
        <Text style={styles.sendText}>{loading ? "■" : "↑"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 26,
    flexDirection: "row",
    gap: 8,
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 12
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
    fontSize: 22,
    fontWeight: "500"
  },
  input: {
    color: colors.accentText,
    flex: 1,
    fontSize: 16,
    maxHeight: 96,
    minHeight: 38
  },
  sendButton: {
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
  disabled: {
    opacity: 0.5
  },
  micButton: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    width: 28
  },
  micText: {
    color: colors.text,
    fontSize: 22
  },
  sendText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900"
  }
});
