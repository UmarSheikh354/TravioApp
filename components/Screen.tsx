import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, View, type ScrollViewProps, type ViewStyle } from "react-native";
import type { PropsWithChildren } from "react";
import { colors } from "@/lib/theme";

type Props = PropsWithChildren<{
  backgroundColor?: string;
  scroll?: boolean;
  refreshControl?: ScrollViewProps["refreshControl"];
  style?: ViewStyle;
}>;

export function Screen({ backgroundColor, children, scroll = true, refreshControl, style }: Props) {
  const content = <View style={[styles.content, style]}>{children}</View>;

  return (
    <SafeAreaView style={[styles.safeArea, backgroundColor ? { backgroundColor } : null]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          refreshControl={refreshControl}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  },
  scrollContent: {
    flexGrow: 1
  },
  content: {
    flex: 1,
    gap: 16,
    paddingHorizontal: 22,
    paddingVertical: 18
  }
});
