import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LoadingDots } from "@/components/LoadingDots";
import { ProductCard } from "@/components/ProductCard";
import { PressableScale } from "@/components/PressableScale";
import { useApp } from "@/context/AppContext";
import { searchProducts } from "@/services/productSearch";
import { colors, radius, spacing } from "@/lib/theme";
import type { Product } from "@/types/travio";

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { isProductSaved, toggleSavedProduct } = useApp();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function runSearch() {
    if (!query.trim()) {
      return;
    }
    setLoading(true);
    setSearched(true);
    const products = await searchProducts(query.trim());
    setResults(products);
    setLoading(false);
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.md }]}>
      <Text style={styles.title}>Search products</Text>

      <View style={styles.searchBar}>
        <Feather name="search" size={18} color={colors.textSecondary} />
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          placeholder="Search Amazon, AliExpress, Temu, Alibaba"
          placeholderTextColor={colors.textSecondary}
          returnKeyType="search"
          onSubmitEditing={runSearch}
        />
        <PressableScale style={styles.searchButton} onPress={runSearch}>
          <Feather name="arrow-right" size={18} color={colors.white} />
        </PressableScale>
      </View>

      {loading ? (
        <View style={styles.center}>
          <LoadingDots />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={styles.cardWrapper}>
              <ProductCard
                product={item}
                index={index}
                grid
                saved={isProductSaved(item.id)}
                onToggleSave={toggleSavedProduct}
              />
            </View>
          )}
          ListEmptyComponent={
            searched ? (
              <Text style={styles.empty}>No products found. Try another search.</Text>
            ) : (
              <View style={styles.center}>
                <Feather name="search" size={40} color={colors.iconMuted} />
                <Text style={styles.empty}>Search across every marketplace at once.</Text>
              </View>
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
  },
  searchButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.textPrimary,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingVertical: spacing.lg,
  },
  row: {
    justifyContent: "space-between",
  },
  cardWrapper: {
    width: "48%",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxl * 2,
    gap: spacing.md,
  },
  empty: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.lg,
  },
});
