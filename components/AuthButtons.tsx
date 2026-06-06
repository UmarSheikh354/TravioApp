import { Pressable, StyleSheet, Text, View } from "react-native";

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
      <AuthButton title="Continue with Apple" icon="●" loading={loading === "apple"} onPress={onApple} />
      <AuthButton title="Continue with Google" icon="G" dark loading={loading === "google"} onPress={onGoogle} />
      <AuthButton title="Sign up with email" icon="✉" dark loading={loading === "email"} onPress={onEmail} />
      <AuthButton title="Log in" outline onPress={onLogin} />
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
    minHeight: 31,
    paddingHorizontal: 12
  },
  authDark: {
    backgroundColor: "#2b2b2d"
  },
  authOutline: {
    backgroundColor: "transparent",
    borderColor: "#202020",
    borderWidth: 1
  },
  authText: {
    color: "#000000",
    fontSize: 11,
    fontWeight: "700"
  },
  authTextLight: {
    color: "#ffffff"
  }
});
