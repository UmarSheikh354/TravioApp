import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "#05070d" },
        headerTintColor: "#fff",
        tabBarActiveTintColor: "#21d4a2",
        tabBarInactiveTintColor: "#8a94a8",
        tabBarStyle: {
          backgroundColor: "#0f1728",
          borderTopColor: "#24304a"
        }
      }}
    >
      <Tabs.Screen name="index" options={{ title: t("home") }} />
      <Tabs.Screen name="orders" options={{ title: t("orders") }} />
      <Tabs.Screen name="profile" options={{ title: t("profile") }} />
    </Tabs>
  );
}
