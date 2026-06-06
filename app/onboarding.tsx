import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { TravioHeader, TravioMark } from "@/components/TravioMark";
import { colors } from "@/lib/theme";

const slides = [
  {
    title: "Describe any product",
    body: "Tell Travio what you need, including quantity, budget, delivery location, or quality requirements."
  },
  {
    title: "Compare 3 suppliers",
    body: "Travio searches Alibaba, Amazon, and Temu and turns results into clear product cards."
  },
  {
    title: "Pay and track",
    body: "Confirm your details, pay with Stripe, and keep order status in one place."
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
      <TravioHeader />
      <View style={styles.hero}>
        <TravioMark size={46} />
        <Text style={styles.counter}>
          {index + 1}/{slides.length}
        </Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.body}>{slide.body}</Text>
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
    marginTop: 42
  },
  counter: {
    color: colors.muted,
    fontWeight: "700"
  },
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 28,
    borderWidth: 1,
    gap: 16,
    minHeight: 230,
    justifyContent: "center",
    padding: 28
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900",
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
