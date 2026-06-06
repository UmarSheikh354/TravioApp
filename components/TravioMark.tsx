import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";

type Props = {
  size?: number;
  showWordmark?: boolean;
};

export function TravioMark({ size = 54, showWordmark = false }: Props) {
  const dotSize = Math.max(6, size * 0.14);

  return (
    <View style={styles.wrap}>
      {showWordmark ? <Text style={styles.wordmark}>TRAVIO</Text> : null}
      <View style={[styles.mark, { height: size, width: size, borderRadius: size / 2 }]}>
        <View style={[styles.outerRing, { borderRadius: size / 2 }]} />
        <View style={[styles.innerDot, { height: dotSize, width: dotSize, borderRadius: dotSize / 2 }]} />
        <View style={[styles.hand, { height: size * 0.28, top: size * 0.2 }]} />
      </View>
    </View>
  );
}

type HeaderProps = {
  onMenuPress?: () => void;
  onEditPress?: () => void;
};

export function TravioHeader({ onMenuPress, onEditPress }: HeaderProps) {
  const showActions = Boolean(onMenuPress || onEditPress);

  return (
    <View style={styles.header}>
      {showActions ? (
        <Pressable accessibilityRole="button" onPress={onMenuPress} style={styles.headerIcon}>
          <Text style={styles.headerIconText}>≡</Text>
        </Pressable>
      ) : (
        <View style={styles.headerIcon} />
      )}
      <Text style={styles.headerTitle}>TRAVIO ›</Text>
      {showActions ? (
        <Pressable accessibilityRole="button" onPress={onEditPress} style={styles.headerIcon}>
          <Text style={styles.headerIconText}>✎</Text>
        </Pressable>
      ) : (
        <View style={styles.headerIcon} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: "center",
    gap: 12
  },
  wordmark: {
    color: colors.text,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.8
  },
  mark: {
    alignItems: "center",
    borderColor: colors.accent,
    borderWidth: 2,
    justifyContent: "center"
  },
  outerRing: {
    borderColor: colors.accent,
    borderWidth: 2,
    bottom: 8,
    left: 8,
    position: "absolute",
    right: 8,
    top: 8
  },
  innerDot: {
    backgroundColor: colors.accent
  },
  hand: {
    backgroundColor: colors.accent,
    borderRadius: 4,
    position: "absolute",
    width: 3
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    width: "100%"
  },
  headerTitle: {
    color: colors.text,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.8
  },
  headerIcon: {
    alignItems: "center",
    height: 34,
    justifyContent: "center",
    width: 34
  },
  headerIconText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800"
  }
});
