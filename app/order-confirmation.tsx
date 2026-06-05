import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { PrimaryButton } from "@/components/PrimaryButton";
import { ProductCard } from "@/components/ProductCard";
import { Screen } from "@/components/Screen";
import { TextField } from "@/components/TextField";
import { useApp } from "@/context/AppContext";
import type { OrderDraft } from "@/types/travio";

export default function OrderConfirmationScreen() {
  const { t } = useTranslation();
  const { selectedProduct, user, setDraft } = useApp();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [quantity, setQuantity] = useState("1");

  useEffect(() => {
    if (!selectedProduct) {
      router.replace("/chat");
    }
  }, [selectedProduct]);

  const total = useMemo(() => {
    const count = Math.max(1, Number(quantity) || 1);
    return selectedProduct ? selectedProduct.price_per_unit * count : 0;
  }, [quantity, selectedProduct]);

  function submit() {
    if (!selectedProduct) {
      return;
    }

    if (!name || !phone || !address || !city || !country) {
      Alert.alert(t("orderForm"), "Please fill in all fields.");
      return;
    }

    const draft: OrderDraft = {
      product: selectedProduct,
      name,
      phone,
      address,
      city,
      country,
      quantity: Math.max(1, Number(quantity) || 1)
    };

    setDraft(draft);
    router.push("/payment");
  }

  if (!selectedProduct) {
    return null;
  }

  return (
    <Screen>
      <Text style={styles.title}>{t("orderForm")}</Text>
      <ProductCard product={selectedProduct} />
      <TextField label={t("name")} value={name} onChangeText={setName} />
      <TextField label={t("phone")} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextField label={t("address")} value={address} onChangeText={setAddress} />
      <TextField label={t("city")} value={city} onChangeText={setCity} />
      <TextField label={t("country")} value={country} onChangeText={setCountry} />
      <TextField label={t("quantity")} value={quantity} onChangeText={setQuantity} keyboardType="number-pad" />
      <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
      <PrimaryButton title={t("continueToPayment")} onPress={submit} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900"
  },
  total: {
    color: "#21d4a2",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "right"
  }
});
