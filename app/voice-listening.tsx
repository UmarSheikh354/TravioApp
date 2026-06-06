import { router } from "expo-router";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { colors } from "@/lib/theme";

const bars = [24, 46, 68, 38, 58, 30, 74, 42, 54];

export default function VoiceListeningScreen() {
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace({ pathname: "/chat", params: { q: "Find me the best product deals today" } });
    }, 3500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Screen scroll={false} style={styles.screen}>
      <View style={styles.center}>
        <View style={styles.waveform}>
          {bars.map((height, index) => (
            <View key={index} style={[styles.bar, { height }]} />
          ))}
        </View>
        <Text style={styles.title}>Listening...</Text>
        <Text style={styles.subtitle}>Speak naturally. Travio will search when you finish.</Text>
      </View>
      <Pressable style={styles.cancel} onPress={() => router.back()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "space-between"
  },
  center: {
    alignItems: "center",
    flex: 1,
    gap: 22,
    justifyContent: "center"
  },
  waveform: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    minHeight: 90
  },
  bar: {
    backgroundColor: colors.control,
    borderRadius: 999,
    width: 8
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.muted,
    fontSize: 14,
    textAlign: "center"
  },
  cancel: {
    alignItems: "center",
    backgroundColor: colors.control,
    borderRadius: 18,
    minHeight: 54,
    justifyContent: "center"
  },
  cancelText: {
    color: colors.inverseText,
    fontWeight: "900"
  }
});
