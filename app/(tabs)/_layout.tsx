import { Tabs } from "expo-router";
import { useTranslation } from "react-i18next";

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: "#D9D9D9" },
        headerTintColor: "#1A1A1A",
        tabBarActiveTintColor: "#1A1A1A",
        tabBarInactiveTintColor: "#6F6F6F",
        tabBarStyle: {
          backgroundColor: "#D9D9D9",
          borderTopColor: "#C7C7C7",
          display: "none"
        }
      }}
    >
      <Tabs.Screen name="index" options={{ title: t("home") }} />
      <Tabs.Screen name="orders" options={{ title: t("orders") }} />
      <Tabs.Screen name="profile" options={{ title: t("profile") }} />
    </Tabs>
  );
}
