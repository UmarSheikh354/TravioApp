import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Logo } from "@/components/Logo";
import { PressableScale } from "@/components/PressableScale";
import { useApp } from "@/context/AppContext";
import { colors, spacing } from "@/lib/theme";

type Slide = {
  key: string;
  kind: "logo" | "logoText" | "headline";
  text?: string;
};

const SLIDES: Slide[] = [
  { key: "1", kind: "logo" },
  { key: "2", kind: "logoText" },
  { key: "3", kind: "headline", text: "Your AI Shopping Companion" },
  { key: "4", kind: "headline", text: "Smart Personal Recommendation" },
];

export default function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { signInWithApple, signInWithGoogle } = useApp();
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  function onScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const next = Math.round(event.nativeEvent.contentOffset.x / width);
    setIndex(next);
  }

  async function handleApple() {
    try {
      await signInWithApple();
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Apple Sign-In", (error as Error).message);
    }
  }

  async function handleGoogle() {
    try {
      await signInWithGoogle();
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Google Sign-In", (error as Error).message);
    }
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.glow} />
            {item.kind === "logo" && <Logo size={88} />}
            {item.kind === "logoText" && (
              <View style={styles.logoText}>
                <Logo size={72} />
                <Text style={styles.brand}>TRAVIO</Text>
              </View>
            )}
            {item.kind === "headline" && (
              <Text style={styles.headline}>{item.text}</Text>
            )}
          </View>
        )}
      />

      <View style={styles.dots}>
        {SLIDES.map((slide, slideIndex) => (
          <View
            key={slide.key}
            style={[styles.dot, slideIndex === index && styles.activeDot]}
          />
        ))}
      </View>

      <View style={[styles.actions, { paddingBottom: insets.bottom + spacing.lg }]}>
        <PressableScale style={[styles.button, styles.appleButton]} onPress={handleApple}>
          <Feather name="command" size={16} color={colors.black} />
          <Text style={styles.appleText}>Continue with Apple</Text>
        </PressableScale>
        <PressableScale style={[styles.button, styles.grayButton]} onPress={handleGoogle}>
          <Feather name="chrome" size={16} color={colors.white} />
          <Text style={styles.grayText}>Continue with Google</Text>
        </PressableScale>
        <PressableScale
          style={[styles.button, styles.grayButton]}
          onPress={() => router.push("/signup")}
        >
          <Feather name="mail" size={16} color={colors.white} />
          <Text style={styles.grayText}>Sign up with email</Text>
        </PressableScale>
        <PressableScale
          style={[styles.button, styles.blackButton]}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.grayText}>Log in</Text>
        </PressableScale>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xxl,
  },
  glow: {
    position: "absolute",
    top: "30%",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  logoText: {
    alignItems: "center",
    gap: spacing.lg,
  },
  brand: {
    color: colors.white,
    fontSize: 32,
    fontWeight: "700",
    letterSpacing: 4,
  },
  headline: {
    color: colors.white,
    fontSize: 34,
    fontWeight: "700",
    lineHeight: 42,
    alignSelf: "flex-start",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  activeDot: {
    backgroundColor: colors.white,
    width: 20,
  },
  actions: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  appleButton: {
    backgroundColor: colors.white,
  },
  appleText: {
    color: colors.black,
    fontSize: 15,
    fontWeight: "600",
  },
  grayButton: {
    backgroundColor: colors.darkSurface,
  },
  grayText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },
  blackButton: {
    backgroundColor: colors.black,
    borderWidth: 1,
    borderColor: colors.darkSurface,
  },
});
