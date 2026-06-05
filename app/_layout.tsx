import "react-native-get-random-values";
import "@/lib/i18n";

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TravioStripeProvider } from "@/components/TravioStripeProvider";
import { AppProvider } from "@/context/AppContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TravioStripeProvider>
        <AppProvider>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: "#05070d" },
              headerTintColor: "#fff",
              contentStyle: { backgroundColor: "#05070d" }
            }}
          >
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="onboarding" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ title: "Login" }} />
            <Stack.Screen name="email-verification" options={{ title: "Email Verification" }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="chat" options={{ title: "Travio AI" }} />
            <Stack.Screen name="order-confirmation" options={{ title: "Confirm Order" }} />
            <Stack.Screen name="payment" options={{ title: "Payment" }} />
            <Stack.Screen name="order-success" options={{ title: "Order Success", headerBackVisible: false }} />
          </Stack>
        </AppProvider>
      </TravioStripeProvider>
    </GestureHandlerRootView>
  );
}
