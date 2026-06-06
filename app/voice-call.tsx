import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { VoiceOrb } from "@/components/VoiceOrb";

export default function VoiceCallScreen() {
  return (
    <Screen scroll={false} style={styles.screen}>
      <View />
      <VoiceOrb size={188} />
      <View style={styles.controls}>
        <Pressable style={styles.stopButton}>
          <Text style={styles.stopText}>■</Text>
        </Pressable>
        <Pressable style={styles.endButton} onPress={() => router.replace("/chat")}>
          <Text style={styles.endText}>×</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    justifyContent: "space-between",
    paddingBottom: 34,
    paddingTop: 90
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%"
  },
  stopButton: {
    alignItems: "center",
    backgroundColor: "#000000",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    width: 50
  },
  stopText: {
    color: "#ffffff",
    fontSize: 20
  },
  endButton: {
    alignItems: "center",
    backgroundColor: "#ff453f",
    borderRadius: 25,
    height: 50,
    justifyContent: "center",
    width: 50
  },
  endText: {
    color: "#ffffff",
    fontSize: 32,
    lineHeight: 34
  }
});
