import { StyleSheet, Text, TextInput, type TextInputProps, View } from "react-native";

type Props = TextInputProps & {
  label: string;
};

export function TextField({ label, style, ...props }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#6f7a91"
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
    color: "#d7deee",
    fontSize: 14,
    fontWeight: "600"
  },
  input: {
    backgroundColor: "#111827",
    borderColor: "#2c3448",
    borderRadius: 14,
    borderWidth: 1,
    color: "#fff",
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12
  }
});
