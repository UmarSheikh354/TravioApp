import { Feather } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { colors } from "@/lib/theme";

export default function VisualSearchScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission?.granted) {
    return (
      <Screen style={styles.centerScreen}>
        <Feather name="camera" size={42} color={colors.text} />
        <Text style={styles.title}>Camera search</Text>
        <Text style={styles.meta}>Use camera search, screenshot search, barcode scanner, QR scanner, and color match.</Text>
        <Pressable style={styles.primary} onPress={requestPermission}>
          <Text style={styles.primaryText}>Allow camera</Text>
        </Pressable>
      </Screen>
    );
  }

  return (
    <Screen scroll={false} style={styles.screen}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e"] }}
        onBarcodeScanned={(result) => {
          router.push({ pathname: "/chat", params: { q: `Find product from barcode or QR: ${result.data}` } });
        }}
      />
      <View style={styles.actions}>
        <Action icon="camera" label="Take photo" onPress={() => router.push({ pathname: "/chat", params: { q: "Find similar products from this camera photo" } })} />
        <Action icon="image" label="Gallery" onPress={() => router.push({ pathname: "/chat", params: { q: "Find similar products from my screenshot" } })} />
        <Action icon="maximize" label="Barcode" onPress={() => Alert.alert("Barcode scanner", "Point your camera at a barcode or QR code.")} />
        <Action icon="droplet" label="Color match" onPress={() => router.push({ pathname: "/chat", params: { q: "Find products in this color" } })} />
      </View>
    </Screen>
  );
}

function Action({ icon, label, onPress }: { icon: keyof typeof Feather.glyphMap; label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.action} onPress={onPress}>
      <Feather name={icon} size={20} color={colors.text} />
      <Text style={styles.actionText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  centerScreen: {
    alignItems: "center",
    gap: 16,
    justifyContent: "center"
  },
  screen: {
    gap: 14
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900"
  },
  meta: {
    color: colors.muted,
    lineHeight: 22,
    textAlign: "center"
  },
  primary: {
    backgroundColor: colors.control,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 14
  },
  primaryText: {
    color: colors.inverseText,
    fontWeight: "900"
  },
  camera: {
    borderRadius: 24,
    flex: 1,
    overflow: "hidden"
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  action: {
    alignItems: "center",
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 12
  },
  actionText: {
    color: colors.text,
    fontWeight: "700"
  }
});
