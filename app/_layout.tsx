import "react-native-get-random-values";
import "@/lib/i18n";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TravioStripeProvider } from "@/components/TravioStripeProvider";
import { AppProvider } from "@/context/AppContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
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
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="email-verification" options={{ headerShown: false }} />
            <Stack.Screen name="privacy-policy" options={{ title: "Privacy Policy" }} />
            <Stack.Screen name="terms-conditions" options={{ title: "Terms and Conditions" }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="chat" options={{ headerShown: false }} />
            <Stack.Screen name="voice-intro" options={{ headerShown: false }} />
            <Stack.Screen name="choose-voice" options={{ headerShown: false }} />
            <Stack.Screen name="voice-call" options={{ headerShown: false }} />
            <Stack.Screen name="order-confirmation" options={{ title: "Confirm Order" }} />
            <Stack.Screen name="payment" options={{ title: "Payment" }} />
            <Stack.Screen name="order-success" options={{ title: "Order Success", headerBackVisible: false }} />
          </Stack>
        </AppProvider>
      </TravioStripeProvider>
    </GestureHandlerRootView>
  );
}
