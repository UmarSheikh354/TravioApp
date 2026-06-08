import { Pressable, StyleSheet, TextInput, type TextInputProps, View } from "react-native";
import { Feather } from "@expo/vector-icons";
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
        <Feather name="plus" size={18} color={colors.text} />
      </Pressable>
      <TextInput
        placeholder="Search for any product..."
        placeholderTextColor="#8C8C8C"
        style={[styles.input, style]}
        multiline
        {...props}
      />
      <Pressable style={styles.micButton} onPress={onVoice}>
        <Feather name="mic" size={18} color={colors.text} />
      </Pressable>
      <Pressable style={[styles.sendButton, disabled && styles.disabled]} disabled={disabled} onPress={onSend}>
        <Feather name={loading ? "square" : "arrow-up"} size={18} color="#FFFFFF" />
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
});
