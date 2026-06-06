import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { TravioMark } from "@/components/TravioMark";
import { colors } from "@/lib/theme";

const slides = [
  {
    title: "TRAVIO",
    body: ""
  },
  {
    title: "Your AI\nShopping\nCompanion",
    body: ""
  },
  {
    title: "“Smart Personal\nRecommendation”",
    body: ""
  }
];

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const slide = slides[index];

  function next() {
    if (index === slides.length - 1) {
      router.replace("/login");
      return;
    }

    setIndex((value) => value + 1);
  }

  return (
    <Screen scroll={false} style={styles.screen}>
      <View style={styles.hero}>
        <TravioMark size={42} showWordmark={index === 0} />
      </View>
      <View style={[styles.card, !slide.body && styles.emptyCard]}>
        <Text style={styles.title}>{slide.title}</Text>
        {slide.body ? <Text style={styles.body}>{slide.body}</Text> : null}
      </View>
      <View style={styles.dots}>
        {slides.map((_, slideIndex) => (
          <View key={slideIndex} style={[styles.dot, slideIndex === index && styles.activeDot]} />
        ))}
      </View>
      <PrimaryButton title={index === slides.length - 1 ? t("getStarted") : t("next")} onPress={next} />
      <PrimaryButton title={t("skip")} variant="secondary" onPress={() => router.replace("/login")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "space-between"
  },
  hero: {
    alignItems: "center",
    gap: 14,
    marginTop: 110
  },
  card: {
    backgroundColor: "transparent",
    gap: 16,
    minHeight: 130,
    justifyContent: "center",
    padding: 28
  },
  emptyCard: {
    marginTop: -30
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "900",
    lineHeight: 24,
    textAlign: "center"
  },
  body: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 20,
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
