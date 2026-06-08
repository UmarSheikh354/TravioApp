import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { Screen } from "@/components/Screen";
import { colors } from "@/lib/theme";

const categories = ["Electronics", "Fashion", "Home", "Beauty", "Sports", "Toys", "Books"];
const countries = ["US", "PK", "AE", "GB", "EU"];
const sorts = ["Price low to high", "Price high to low", "Most popular", "Best rated"];

export default function SmartSearchScreen() {
  const [budget, setBudget] = useState("50");
  const [country, setCountry] = useState("PK");
  const [fourStars, setFourStars] = useState(true);
  const [sort, setSort] = useState(sorts[0]);
  const [category, setCategory] = useState(categories[0]);

  function runSearch() {
    router.push({
      pathname: "/chat",
      params: {
        q: `${category} products under $${budget} ship to ${country} ${fourStars ? "4 stars and above" : ""} ${sort}`
      }
    });
  }

  return (
    <Screen>
      <Text style={styles.title}>Smart Search</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Budget</Text>
        <TextInput value={budget} onChangeText={setBudget} keyboardType="number-pad" style={styles.input} />
        <Text style={styles.label}>Shipping country</Text>
        <View style={styles.rowWrap}>
          {countries.map((item) => (
            <Chip key={item} active={country === item} label={item} onPress={() => setCountry(item)} />
          ))}
        </View>
        <Text style={styles.label}>Category</Text>
        <View style={styles.rowWrap}>
          {categories.map((item) => (
            <Chip key={item} active={category === item} label={item} onPress={() => setCategory(item)} />
          ))}
        </View>
        <Text style={styles.label}>Sort</Text>
        <View style={styles.rowWrap}>
          {sorts.map((item) => (
            <Chip key={item} active={sort === item} label={item} onPress={() => setSort(item)} />
          ))}
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.label}>4 stars and above</Text>
          <Switch value={fourStars} onValueChange={setFourStars} />
        </View>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gift finder</Text>
        <Text style={styles.meta}>Travio detects gift queries like gift for mom under $50 and filters by budget/person.</Text>
      </View>
      <Pressable style={styles.primary} onPress={runSearch}>
        <Text style={styles.primaryText}>Search products</Text>
      </Pressable>
    </Screen>
  );
}

function Chip({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable style={[styles.chip, active && styles.activeChip]} onPress={onPress}>
      <Text style={[styles.chipText, active && styles.activeChipText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900"
  },
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    padding: 14
  },
  label: {
    color: colors.text,
    fontWeight: "800"
  },
  input: {
    backgroundColor: colors.panelSoft,
    borderRadius: 12,
    color: colors.text,
    minHeight: 44,
    paddingHorizontal: 12
  },
  rowWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  chip: {
    backgroundColor: colors.panelSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  activeChip: {
    backgroundColor: colors.control
  },
  chipText: {
    color: colors.text,
    fontWeight: "700"
  },
  activeChipText: {
    color: colors.inverseText
  },
  toggleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  cardTitle: {
    color: colors.text,
    fontWeight: "900"
  },
  meta: {
    color: colors.muted,
    lineHeight: 22
  },
  primary: {
    alignItems: "center",
    backgroundColor: colors.control,
    borderRadius: 14,
    minHeight: 52,
    justifyContent: "center"
  },
  primaryText: {
    color: colors.inverseText,
    fontSize: 16,
    fontWeight: "900"
  }
});
