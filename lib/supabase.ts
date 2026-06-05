import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, isConfigured } from "@/lib/env";
import type { OrderDraft, TravioOrder, TravioUser } from "@/types/travio";

const LOCAL_ORDERS_KEY = "travio.local.orders";
const LOCAL_USER_KEY = "travio.local.user";

export const isSupabaseConfigured = isConfigured(env.supabaseUrl) && isConfigured(env.supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(env.supabaseUrl!, env.supabaseAnonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
      }
    })
  : null;

function makeTrackingNumber() {
  return `TRV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

export function makeLocalUser(email: string, name = "Travio User", agreementAcceptedAt?: string): TravioUser {
  return {
    id: `local-${email.toLowerCase()}`,
    name,
    email,
    agreement_accepted_at: agreementAcceptedAt,
    created_at: new Date().toISOString()
  };
}

export async function storeLocalUser(user: TravioUser) {
  await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
}

export async function getLocalUser() {
  const raw = await AsyncStorage.getItem(LOCAL_USER_KEY);
  return raw ? (JSON.parse(raw) as TravioUser) : null;
}

export async function clearLocalUser() {
  await AsyncStorage.removeItem(LOCAL_USER_KEY);
}

export async function upsertUserProfile(user: TravioUser) {
  if (!supabase) {
    await storeLocalUser(user);
    return user;
  }

  const { error } = await supabase.from("users").upsert({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    ...(user.address ? { address: user.address } : {}),
    ...(user.agreement_accepted_at ? { agreement_accepted_at: user.agreement_accepted_at } : {}),
    created_at: user.created_at
  });

  if (error) {
    throw new Error(error.message);
  }

  return user;
}

export async function saveOrder(userId: string, draft: OrderDraft): Promise<TravioOrder> {
  const order: TravioOrder = {
    id: crypto.randomUUID(),
    user_id: userId,
    product_name: draft.product.name,
    quantity: draft.quantity,
    price_per_unit: draft.product.price_per_unit,
    total_price: draft.product.price_per_unit * draft.quantity,
    supplier: draft.product.supplier,
    delivery_address: draft.address,
    city: draft.city,
    country: draft.country,
    status: "processing",
    created_at: new Date().toISOString(),
    tracking_number: makeTrackingNumber()
  };

  if (!supabase) {
    const existing = await getOrders(userId);
    await AsyncStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([order, ...existing]));
    return order;
  }

  const { data, error } = await supabase
    .from("orders")
    .insert({
      id: order.id,
      user_id: order.user_id,
      product_name: order.product_name,
      quantity: order.quantity,
      price_per_unit: order.price_per_unit,
      total_price: order.total_price,
      supplier: order.supplier,
      delivery_address: order.delivery_address,
      city: order.city,
      country: order.country,
      status: order.status,
      tracking_number: order.tracking_number,
      created_at: order.created_at
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...order,
    ...data,
    tracking_number: order.tracking_number
  };
}

export async function getOrders(userId: string): Promise<TravioOrder[]> {
  if (!supabase) {
    const raw = await AsyncStorage.getItem(LOCAL_ORDERS_KEY);
    const orders = raw ? (JSON.parse(raw) as TravioOrder[]) : [];
    return orders.filter((order) => order.user_id === userId);
  }

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((order) => ({
    id: order.id,
    user_id: order.user_id,
    product_name: order.product_name,
    quantity: order.quantity,
    price_per_unit: Number(order.price_per_unit),
    total_price: Number(order.total_price),
    supplier: order.supplier,
    delivery_address: order.delivery_address,
    city: order.city,
    country: order.country,
    status: order.status,
    created_at: order.created_at,
    tracking_number: order.tracking_number ?? makeTrackingNumber()
  }));
}
