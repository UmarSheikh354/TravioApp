import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<
  PressableProps & {
    style?: StyleProp<ViewStyle>;
  }
>;

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

export function AnimatedPressable({ children, onPressIn, onPressOut, style, ...props }: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  return (
    <AnimatedPressableBase
      {...props}
      onPressIn={(event) => {
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withTiming(0.97, { duration: 100 });
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        // eslint-disable-next-line react-hooks/immutability
        scale.value = withTiming(1, { duration: 100 });
        onPressOut?.(event);
      }}
      style={[style, animatedStyle]}
    >
      {children}
    </AnimatedPressableBase>
  );
}
