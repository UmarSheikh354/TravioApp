import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";

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
      <View style={styles.hero}>
        <Text style={styles.logo}>{t("appName")}</Text>
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
    justifyContent: "center"
  },
  hero: {
    alignItems: "center",
    gap: 10
  },
  logo: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "900"
  },
  counter: {
    color: "#21d4a2",
    fontWeight: "700"
  },
  card: {
    backgroundColor: "#0f1728",
    borderColor: "#24304a",
    borderRadius: 28,
    borderWidth: 1,
    gap: 16,
    minHeight: 280,
    justifyContent: "center",
    padding: 28
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
    textAlign: "center"
  },
  body: {
    color: "#c5ccdc",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center"
  },
  dots: {
    flexDirection: "row",
    gap: 8,
    justifyContent: "center"
  },
  dot: {
    backgroundColor: "#2c3448",
    borderRadius: 99,
    height: 8,
    width: 8
  },
  activeDot: {
    backgroundColor: "#21d4a2",
    width: 28
  }
});
