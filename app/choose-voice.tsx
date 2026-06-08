import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { VoiceOrb } from "@/components/VoiceOrb";
import { colors } from "@/lib/theme";

const voices = ["Breeze", "Cove", "Sky", "Juniper", "Ember"];

export default function ChooseVoiceScreen() {
  const [selected, setSelected] = useState("Juniper");

  return (
    <Screen backgroundColor="#f9f9f9" scroll={false} style={styles.screen}>
      <Pressable style={styles.close} onPress={() => router.back()}>
        <Text style={styles.closeText}>×</Text>
      </Pressable>
      <View style={styles.top}>
        <Text style={styles.title}>Choose a voice</Text>
        <Text style={styles.subtitle}>You can change this later.</Text>
      </View>
      <VoiceOrb size={154} />
      <View style={styles.list}>
        {voices.map((voice) => (
          <Pressable key={voice} style={styles.voiceRow} onPress={() => setSelected(voice)}>
            <Text style={styles.voiceText}>{voice}</Text>
            {voice === selected ? <Text style={styles.check}>✓</Text> : null}
          </Pressable>
        ))}
      </View>
      <PrimaryButton title="Confirm" onPress={() => router.replace("/voice-call")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    justifyContent: "space-between",
    paddingBottom: 32,
    paddingTop: 64
  },
  close: {
    alignItems: "center",
    backgroundColor: "#dddddf",
    borderRadius: 12,
    height: 24,
    justifyContent: "center",
    position: "absolute",
    right: 18,
    top: 50,
    width: 24
  },
  closeText: {
    color: "#b0b0b5",
    fontSize: 17,
    fontWeight: "900"
  },
  top: {
    alignItems: "center",
    gap: 4
  },
  title: {
    color: "#171717",
    fontSize: 17,
    fontWeight: "600"
  },
  subtitle: {
    color: "#8f8f96",
    fontSize: 10
  },
  list: {
    gap: 8,
    width: "100%"
  },
  voiceRow: {
    alignItems: "center",
    backgroundColor: "#9b9b9f",
    borderRadius: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 44,
    paddingHorizontal: 18
  },
  voiceText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800"
  },
  check: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900"
  }
});
