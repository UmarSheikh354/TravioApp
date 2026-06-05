import { ActivityIndicator, Modal, StyleSheet, Text, View } from "react-native";

type Props = {
  visible: boolean;
  message: string;
};

export function LoadingOverlay({ visible, message }: Props) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <ActivityIndicator color="#21d4a2" size="large" />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: "center",
    backgroundColor: "rgba(5,7,13,0.82)",
    flex: 1,
    justifyContent: "center",
    padding: 24
  },
  card: {
    alignItems: "center",
    backgroundColor: "#0f1728",
    borderColor: "#24304a",
    borderRadius: 24,
    borderWidth: 1,
    gap: 16,
    padding: 28
  },
  message: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center"
  }
});
