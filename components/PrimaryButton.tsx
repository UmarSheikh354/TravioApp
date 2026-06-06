import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { colors, radii } from "@/lib/theme";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

export function PrimaryButton({ title, onPress, loading = false, disabled = false, variant = "primary" }: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "secondary" && styles.secondary,
        isDisabled && styles.disabled,
        pressed && styles.pressed
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" ? colors.text : colors.accentText} />
      ) : (
        <Text style={[styles.text, variant === "secondary" && styles.secondaryText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.control,
    borderRadius: radii.control,
    minHeight: 34,
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 9
  },
  secondary: {
    backgroundColor: colors.panelSoft,
    borderColor: colors.border,
    borderWidth: 1
  },
  disabled: {
    opacity: 0.55
  },
  pressed: {
    opacity: 0.8
  },
  text: {
    color: colors.inverseText,
    fontSize: 12,
    fontWeight: "800"
  },
  secondaryText: {
    color: colors.text
  }
});
