export const colors = {
  background: "#D9D9D9",
  surface: "#FFFFFF",
  textPrimary: "#1A1A1A",
  textSecondary: "#666666",
  accent: "#0057FF",
  border: "#E0E0E0",
  sidebar: "#C8C8C8",
  dark: "#1A1A1A",
  darkSurface: "#2A2A2A",
  iconMuted: "#999999",
  settingsBackground: "#F2F2F2",
  white: "#FFFFFF",
  black: "#000000",
  danger: "#E5484D",
  success: "#22C55E",
} as const;

export const platformColors = {
  Amazon: "#FF9900",
  AliExpress: "#E62E04",
  Temu: "#FB7701",
  Alibaba: "#FF6A00",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  title: 32,
  heading: 24,
  subheading: 18,
  body: 16,
  small: 14,
  caption: 12,
} as const;

export const logoSource = require("@/assets/images/travio-logo.png");
