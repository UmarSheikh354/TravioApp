import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView, StyleSheet, View, type ScrollViewProps, type ViewStyle } from "react-native";
import type { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  scroll?: boolean;
  refreshControl?: ScrollViewProps["refreshControl"];
  style?: ViewStyle;
}>;

export function Screen({ children, scroll = true, refreshControl, style }: Props) {
  const content = <View style={[styles.content, style]}>{children}</View>;

  return (
    <SafeAreaView style={styles.safeArea}>
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
    backgroundColor: "#05070d"
  },
  scrollContent: {
    flexGrow: 1
  },
  content: {
    flex: 1,
    padding: 20,
    gap: 16
  }
});
