import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/lib/theme";

type Props = {
  size?: number;
  showWordmark?: boolean;
};

export function TravioMark({ size = 54, showWordmark = false }: Props) {
  return (
    <View style={styles.wrap}>
      {showWordmark ? <Text style={styles.wordmark}>TRAVIO</Text> : null}
      <Image source={require("../assets/travio-logo.png")} style={{ height: size, width: size }} resizeMode="contain" />
    </View>
  );
}

type HeaderProps = {
  onMenuPress?: () => void;
  onEditPress?: () => void;
  onTitlePress?: () => void;
};

export function TravioHeader({ onMenuPress, onEditPress, onTitlePress }: HeaderProps) {
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
      <Pressable onPress={onTitlePress} disabled={!onTitlePress} style={styles.headerCenter}>
        <Image source={require("../assets/travio-logo.png")} style={styles.headerLogo} resizeMode="contain" />
        <Text style={styles.headerTitle}>TRAVIO ›</Text>
      </Pressable>
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
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0.4
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
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.7
  },
  headerCenter: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6
  },
  headerLogo: {
    height: 18,
    tintColor: colors.text,
    width: 18
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
