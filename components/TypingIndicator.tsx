import { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { TravioMark } from "@/components/TravioMark";
import { colors } from "@/lib/theme";

const messages = [
  "Travio is thinking...",
  "Finding the best options for you...",
  "Searching for great deals...",
  "Comparing prices for you...",
  "Getting smart recommendations...",
  "Travio is on it..."
];

export function TypingIndicator() {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * messages.length));
  const [fade] = useState(() => new Animated.Value(1));
  const [dots] = useState(() => [new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fade, { duration: 220, toValue: 0, useNativeDriver: true }),
        Animated.timing(fade, { duration: 220, toValue: 1, useNativeDriver: true })
      ]).start();
      setIndex((value) => (value + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [fade]);

  useEffect(() => {
    const animations = dots.map((dot, dotIndex) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(dotIndex * 140),
          Animated.timing(dot, { duration: 280, toValue: -8, useNativeDriver: true }),
          Animated.timing(dot, { duration: 280, toValue: 0, useNativeDriver: true })
        ])
      )
    );
    animations.forEach((animation) => animation.start());
    return () => animations.forEach((animation) => animation.stop());
  }, [dots]);

  return (
    <View style={styles.row}>
      <TravioMark size={24} />
      <View style={styles.content}>
        <View style={styles.dots}>
          {dots.map((dot, dotIndex) => (
            <Animated.View key={dotIndex} style={[styles.dot, { transform: [{ translateY: dot }] }]} />
          ))}
        </View>
        <Animated.Text style={[styles.message, { opacity: fade }]}>{messages[index]}</Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 12,
    paddingVertical: 8
  },
  content: {
    gap: 8,
    paddingTop: 4
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    height: 16
  },
  dot: {
    backgroundColor: colors.text,
    borderRadius: 4,
    height: 8,
    width: 8
  },
  message: {
    color: colors.muted,
    fontSize: 14
  }
});
