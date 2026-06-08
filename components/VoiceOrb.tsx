import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

type Props = {
  size?: number;
};

export function VoiceOrb({ size = 150 }: Props) {
  return (
    <LinearGradient
      colors={["#00e7ff", "#2f6dff", "#f51eff"]}
      start={{ x: 0.8, y: 0 }}
      end={{ x: 0.15, y: 1 }}
      style={[styles.orb, { borderRadius: size / 2, height: size, width: size }]}
    >
      <LinearGradient
        colors={["rgba(255,255,255,0.96)", "rgba(86,160,255,0.94)", "rgba(13,31,167,0.78)"]}
        start={{ x: 0.28, y: 0.18 }}
        end={{ x: 0.86, y: 0.88 }}
        style={[styles.inner, { borderRadius: size / 2, height: size * 0.78, width: size * 0.78 }]}
      >
        <View style={[styles.highlight, { borderRadius: size / 3, height: size * 0.34, width: size * 0.55 }]} />
      </LinearGradient>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  orb: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#22ecff",
    shadowOffset: { height: 12, width: 0 },
    shadowOpacity: 0.38,
    shadowRadius: 22
  },
  inner: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    overflow: "hidden"
  },
  highlight: {
    backgroundColor: "rgba(255,255,255,0.62)",
    marginLeft: 18,
    marginTop: 14,
    transform: [{ rotate: "-22deg" }]
  }
});
