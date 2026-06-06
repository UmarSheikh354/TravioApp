import { router } from "expo-router";
import { useState } from "react";
import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { AuthButtons } from "@/components/AuthButtons";
import { Screen } from "@/components/Screen";
import { TravioMark } from "@/components/TravioMark";
import { useApp } from "@/context/AppContext";
import { colors } from "@/lib/theme";

const slides = [
  {
    type: "logoOnly"
  },
  {
    type: "logoButtons"
  },
  {
    type: "logoTextButtons"
  },
  {
    title: "Your AI\nShopping\nCompanion",
    type: "textButtons"
  },
  {
    title: "Smart Personal\nRecommendation",
    type: "textButtons"
  },
  {
    type: "verify"
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
        {slides.map((slide, slideIndex) => (
          <View key={`${slide.type}-${slideIndex}`} style={[styles.slide, slide.type === "logoOnly" && styles.logoOnlySlide, { width: width - 44 }]}>
            {slide.type === "logoOnly" ? <TravioMark size={48} /> : null}
            {slide.type === "logoButtons" ? <TravioMark size={48} /> : null}
            {slide.type === "logoTextButtons" ? <TravioMark size={48} showWordmark /> : null}
            {slide.type === "textButtons" && "title" in slide ? <Text style={styles.title}>{slide.title}</Text> : null}
            {slide.type === "verify" ? (
              <View style={styles.verifySlide}>
                <TravioMark size={24} />
                <View style={styles.envelopeWrap}>
                  <Text style={styles.envelope}>✉</Text>
                  <View style={styles.redDot} />
                </View>
                <Text style={styles.verifyText}>Tap on the link we sent to{"\n"}your email</Text>
                <View style={styles.verifyButtons}>
                  <VerifyButton title="I've verified my email" onPress={() => router.replace("/(tabs)")} />
                  <VerifyButton title="Sign out" onPress={() => router.replace("/login")} />
                </View>
              </View>
            ) : null}
          </View>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {slides.map((_, slideIndex) => (
          <View key={slideIndex} style={[styles.dot, slideIndex === index && styles.activeDot]} />
        ))}
      </View>
      {index >= 1 && index <= 4 ? (
        <AuthButtons
          loading={loading}
          onApple={() => social("apple")}
          onGoogle={() => social("google")}
          onEmail={() => router.push("/login")}
          onLogin={() => router.push("/login")}
        />
      ) : (
        <View style={styles.bottomSpacer} />
      )}
    </Screen>
  );
}

function VerifyButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <Pressable style={styles.verifyButton} onPress={onPress}>
      <Text style={styles.verifyButtonText}>{title}</Text>
    </Pressable>
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
    minHeight: 390
  },
  logoOnlySlide: {
    justifyContent: "flex-end",
    paddingBottom: 120
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
  },
  bottomSpacer: {
    minHeight: 145
  },
  verifySlide: {
    alignItems: "center",
    gap: 26,
    width: "100%"
  },
  envelopeWrap: {
    position: "relative"
  },
  envelope: {
    color: colors.accent,
    fontSize: 48
  },
  redDot: {
    backgroundColor: "#ff453f",
    borderRadius: 6,
    height: 12,
    position: "absolute",
    right: -2,
    top: 5,
    width: 12
  },
  verifyText: {
    color: colors.muted,
    fontSize: 10,
    lineHeight: 15,
    textAlign: "center"
  },
  verifyButtons: {
    gap: 8,
    marginTop: 60,
    width: "100%"
  },
  verifyButton: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 7,
    justifyContent: "center",
    minHeight: 38
  },
  verifyButtonText: {
    color: "#000000",
    fontSize: 11,
    fontWeight: "700"
  }
});
