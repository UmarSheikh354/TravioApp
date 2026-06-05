import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { TravioOrder } from "@/types/travio";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    return null;
  }

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;

  if (status !== "granted") {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }

  if (status !== "granted") {
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("orders", {
      name: "Order updates",
      importance: Notifications.AndroidImportance.DEFAULT
    });
  }

  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
}

export async function notifyOrderUpdate(order: TravioOrder) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Travio order confirmed",
      body: `${order.product_name} is now ${order.status}. Tracking: ${order.tracking_number}`,
      data: {
        orderId: order.id,
        trackingNumber: order.tracking_number
      }
    },
    trigger: null
  });
}
