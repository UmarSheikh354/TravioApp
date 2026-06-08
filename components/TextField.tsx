import { StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native";
import { colors, radii } from "@/lib/theme";

type Props = TextInputProps & {
  label: string;
};

export function TextField({ label, style, ...props }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.dim}
        style={[styles.input, style]}
        autoCapitalize="none"
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8
  },
  label: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700"
  },
  input: {
    backgroundColor: colors.accent,
    borderColor: "#b9edf2",
    borderRadius: radii.control,
    borderWidth: 1,
    color: colors.accentText,
    minHeight: 38,
    paddingHorizontal: 14,
    paddingVertical: 9
  }
});
