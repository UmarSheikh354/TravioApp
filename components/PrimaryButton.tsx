import { ActivityIndicator, StyleSheet, Text } from "react-native";
import { AnimatedPressable } from "@/components/AnimatedPressable";
import { colors } from "@/lib/theme";

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
    <AnimatedPressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      style={[
        styles.button,
        variant === "secondary" && styles.secondary,
        isDisabled && styles.disabled
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "secondary" ? colors.text : colors.accentText} />
      ) : (
        <Text style={[styles.text, variant === "secondary" && styles.secondaryText]}>{title}</Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.control,
    borderRadius: 14,
    minHeight: 52,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 14
  },
  secondary: {
    backgroundColor: colors.panel,
    borderColor: colors.control,
    borderWidth: 1.5
  },
  disabled: {
    opacity: 0.55
  },
  text: {
    color: colors.inverseText,
    fontSize: 16,
    fontWeight: "600"
  },
  secondaryText: {
    color: colors.text
  }
});
