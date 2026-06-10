import { Image, type ImageStyle, type StyleProp } from "react-native";
import { logoSource } from "@/lib/theme";

interface LogoProps {
  size?: number;
  style?: StyleProp<ImageStyle>;
}

export function Logo({ size = 64, style }: LogoProps) {
  return (
    <Image
      source={logoSource}
      style={[{ width: size, height: size, resizeMode: "contain" }, style]}
      accessibilityLabel="Travio logo"
    />
  );
}
