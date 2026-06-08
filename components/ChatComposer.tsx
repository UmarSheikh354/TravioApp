import { StyleSheet, TextInput, type TextInputProps, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AnimatedPressable } from "@/components/AnimatedPressable";
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
      <AnimatedPressable style={styles.plusButton} onPress={onAttach}>
        <Feather name="plus" size={18} color={colors.text} />
      </AnimatedPressable>
      <TextInput
        placeholder="Search for any product..."
        placeholderTextColor="#8C8C8C"
        style={[styles.input, style]}
        multiline
        {...props}
      />
      <AnimatedPressable style={styles.micButton} onPress={onVoice}>
        <Feather name="mic" size={18} color={colors.text} />
      </AnimatedPressable>
      <AnimatedPressable style={[styles.sendButton, disabled && styles.disabled]} disabled={disabled} onPress={onSend}>
        <Feather name={loading ? "square" : "arrow-up"} size={18} color="#FFFFFF" />
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 28,
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    marginHorizontal: 16,
    maxHeight: 200,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 8
  },
  plusButton: {
    alignItems: "center",
    backgroundColor: "#F0F0F0",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
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
    backgroundColor: "#F0F0F0",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36
  },
});
