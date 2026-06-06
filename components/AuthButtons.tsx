import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  loading?: "apple" | "google" | "email" | null;
  onApple: () => void;
  onEmail: () => void;
  onGoogle: () => void;
  onLogin: () => void;
};

export function AuthButtons({ loading, onApple, onEmail, onGoogle, onLogin }: Props) {
  return (
    <View style={styles.controls}>
      {Platform.OS === "ios" ? (
        <AuthButton title="Continue with Apple" icon="" dark loading={loading === "apple"} onPress={onApple} />
      ) : null}
      <AuthButton title="Continue with Google" icon="G" loading={loading === "google"} onPress={onGoogle} />
      <AuthButton title="Sign up with email" icon="✉" dark loading={loading === "email"} onPress={onEmail} />
      <AuthButton title="Log in" dark onPress={onLogin} />
    </View>
  );
}

type ButtonProps = {
  title: string;
  dark?: boolean;
  icon?: string;
  loading?: boolean;
  outline?: boolean;
  onPress: () => void;
};

function AuthButton({ title, dark, icon, loading, outline, onPress }: ButtonProps) {
  return (
    <Pressable style={[styles.authButton, dark && styles.authDark, outline && styles.authOutline]} onPress={onPress}>
      <Text style={[styles.authText, (dark || outline) && styles.authTextLight]}>
        {loading ? "..." : icon ? `${icon}  ${title}` : title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  controls: {
    gap: 7,
    width: "100%"
  },
  authButton: {
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    borderRadius: 7,
    justifyContent: "center",
    minHeight: 40,
    paddingHorizontal: 12
  },
  authDark: {
    backgroundColor: "#2b2b2d"
  },
  authOutline: {
    backgroundColor: "#000000",
    borderColor: "#000000",
    borderWidth: 1
  },
  authText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700"
  },
  authTextLight: {
    color: "#ffffff"
  }
});
