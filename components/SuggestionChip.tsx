import { Feather } from "@expo/vector-icons";
import { StyleSheet, Text } from "react-native";
import { PressableScale } from "@/components/PressableScale";
import { colors, radius, spacing } from "@/lib/theme";

interface SuggestionChipProps {
  label: string;
  icon: keyof typeof Feather.glyphMap;
  onPress: () => void;
}

export function SuggestionChip({ label, icon, onPress }: SuggestionChipProps) {
  return (
    <PressableScale style={styles.chip} onPress={onPress}>
      <Feather name={icon} size={16} color={colors.textPrimary} />
      <Text style={styles.label}>{label}</Text>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
});
