import { router } from "expo-router";
import { useState } from "react";
import { Alert, Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { AuthButtons } from "@/components/AuthButtons";
import { Screen } from "@/components/Screen";
import { useApp } from "@/context/AppContext";
import { colors } from "@/lib/theme";

const slides = [
  {
    title: "Your AI\nShopping\nCompanion"
  },
  {
    title: "“Smart Personal\nRecommendation”"
  }
];

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const { signInWithApple, signInWithGoogle } = useApp();
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState<"apple" | "google" | "email" | null>(null);
  const width = Dimensions.get("window").width;

  async function social(provider: "apple" | "google") {
    try {
      setLoading(provider);
      if (provider === "apple") {
        await signInWithApple(new Date().toISOString());
      } else {
        await signInWithGoogle(new Date().toISOString());
      }
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(t("login"), error instanceof Error ? error.message : "Social login failed.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <Screen scroll={false} style={styles.screen}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.slider}
        onMomentumScrollEnd={(event) => setIndex(Math.round(event.nativeEvent.contentOffset.x / width))}
      >
        {slides.map((slide) => (
          <View key={slide.title} style={[styles.slide, { width: width - 44 }]}>
            <Text style={styles.title}>{slide.title}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {slides.map((_, slideIndex) => (
          <View key={slideIndex} style={[styles.dot, slideIndex === index && styles.activeDot]} />
        ))}
      </View>
      <AuthButtons
        loading={loading}
        onApple={() => social("apple")}
        onGoogle={() => social("google")}
        onEmail={() => router.push("/login")}
        onLogin={() => router.push("/login")}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "space-between"
  },
  slider: {
    flexGrow: 0,
    marginTop: 130
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 230
  },
  title: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "900",
    lineHeight: 25,
    textAlign: "center"
  },
  dots: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center"
  },
  dot: {
    backgroundColor: colors.control,
    borderRadius: 99,
    height: 8,
    width: 8
  },
  activeDot: {
    backgroundColor: colors.accent,
    width: 28
  }
});
