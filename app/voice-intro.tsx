import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/Screen";
import { colors } from "@/lib/theme";

const bullets = [
  ["▥", "Just start talking", "Now you can have spoken conversations with Travio."],
  ["◖", "Hands-free", "Chat without having to look at your screen."],
  ["▣", "Chats are saved", "View voice transcripts in your history. Audio clips are not stored."],
  ["⚑", "Language is auto-detected", "You can specify a preferred language in Settings for accurate detection."]
];

export default function VoiceIntroScreen() {
  return (
    <Screen scroll={false} style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.title}>Chat with voice</Text>
        <View style={styles.bullets}>
          {bullets.map(([icon, title, body]) => (
            <View key={title} style={styles.bullet}>
              <Text style={styles.icon}>{icon}</Text>
              <View style={styles.bulletText}>
                <Text style={styles.bulletTitle}>{title}</Text>
                <Text style={styles.body}>{body}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <Pressable style={styles.chooseButton} onPress={() => router.push("/choose-voice")}>
        <Text style={styles.chooseText}>Choose a voice</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "space-between",
    paddingBottom: 34,
    paddingTop: 96
  },
  content: {
    gap: 28
  },
  title: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900"
  },
  bullets: {
    gap: 18
  },
  bullet: {
    flexDirection: "row",
    gap: 16
  },
  icon: {
    color: colors.text,
    fontSize: 17,
    width: 24
  },
  bulletText: {
    flex: 1,
    gap: 4
  },
  bulletTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900"
  },
  body: {
    color: "#bebec4",
    fontSize: 13,
    lineHeight: 18
  },
  chooseButton: {
    alignItems: "center",
    backgroundColor: "#9b9b9f",
    borderRadius: 9,
    minHeight: 44,
    justifyContent: "center"
  },
  chooseText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "800"
  }
});
