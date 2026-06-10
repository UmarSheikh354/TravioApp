import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { colors, spacing } from "@/lib/theme";

const MESSAGES = [
  "Travio is thinking...",
  "Finding best options...",
  "Comparing prices...",
];

function Dot({ delay }: { delay: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-5, { duration: 300 }),
          withTiming(0, { duration: 300 }),
        ),
        -1,
      ),
    );
  }, [delay, translateY]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[styles.dot, style]} />;
}

export function LoadingDots() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((index) => (index + 1) % MESSAGES.length);
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        <Dot delay={0} />
        <Dot delay={200} />
        <Dot delay={400} />
      </View>
      <Text style={styles.message}>{MESSAGES[messageIndex]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.sm,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.textSecondary,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
