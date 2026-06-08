import { useEffect, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

export function LoadingDots() {
  const [values] = useState(() => [new Animated.Value(0.35), new Animated.Value(0.35), new Animated.Value(0.35)]);

  useEffect(() => {
    const animations = values.map((value, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 160),
          Animated.timing(value, {
            toValue: 1,
            duration: 320,
            useNativeDriver: true
          }),
          Animated.timing(value, {
            toValue: 0.35,
            duration: 320,
            useNativeDriver: true
          })
        ])
      )
    );

    animations.forEach((animation) => animation.start());
    return () => animations.forEach((animation) => animation.stop());
  }, [values]);

  return (
    <View style={styles.row}>
      {values.map((value, index) => (
        <Animated.View key={index} style={[styles.dot, { opacity: value, transform: [{ scale: value }] }]} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 6
  },
  dot: {
    backgroundColor: "#21d4a2",
    borderRadius: 999,
    height: 8,
    width: 8
  }
});
