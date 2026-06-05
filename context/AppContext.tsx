import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AppleAuthentication from "expo-apple-authentication";
import * as WebBrowser from "expo-web-browser";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { Alert } from "react-native";
import { useTranslation } from "react-i18next";
import {
  clearLocalUser,
  getLocalUser,
  getOrders,
  isSupabaseConfigured,
  makeLocalUser,
  saveOrder,
  storeLocalUser,
  supabase,
  upsertUserProfile
} from "@/lib/supabase";
import { registerForPushNotifications } from "@/services/notifications";
import type { OrderDraft, ProductOption, SupportedLanguage, TravioOrder, TravioUser } from "@/types/travio";

WebBrowser.maybeCompleteAuthSession();

type AppContextValue = {
  user: TravioUser | null;
  loading: boolean;
  selectedProduct: ProductOption | null;
  orderDraft: OrderDraft | null;
  latestOrder: TravioOrder | null;
  orders: TravioOrder[];
  language: SupportedLanguage;
  signInWithEmail: (email: string) => Promise<void>;
  verifyEmail: (email: string, token: string) => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  selectProduct: (product: ProductOption) => void;
  setDraft: (draft: OrderDraft) => void;
  completeOrder: (draft: OrderDraft) => Promise<TravioOrder>;
  refreshOrders: () => Promise<void>;
  setLanguage: (language: SupportedLanguage) => Promise<void>;
};

const LANGUAGE_KEY = "travio.language";
const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
  const { i18n } = useTranslation();
  const [user, setUser] = useState<TravioUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(null);
  const [orderDraft, setOrderDraft] = useState<OrderDraft | null>(null);
  const [latestOrder, setLatestOrder] = useState<TravioOrder | null>(null);
  const [orders, setOrders] = useState<TravioOrder[]>([]);
  const [language, setLanguageState] = useState<SupportedLanguage>("en");

  const refreshOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }

    const userOrders = await getOrders(user.id);
    setOrders(userOrders);
  }, [user]);

  useEffect(() => {
    async function bootstrap() {
      try {
        const storedLanguage = (await AsyncStorage.getItem(LANGUAGE_KEY)) as SupportedLanguage | null;
        if (storedLanguage && ["en", "ur", "ar"].includes(storedLanguage)) {
          setLanguageState(storedLanguage);
          await i18n.changeLanguage(storedLanguage);
        }

        if (supabase) {
          const { data } = await supabase.auth.getUser();
          if (data.user?.email) {
            const profile: TravioUser = {
              id: data.user.id,
              name: data.user.user_metadata?.name ?? data.user.email.split("@")[0],
              email: data.user.email,
              phone: data.user.phone ?? undefined,
              created_at: data.user.created_at
            };
            setUser(profile);
            await upsertUserProfile(profile);
          }
        } else {
          setUser(await getLocalUser());
        }

        await registerForPushNotifications();
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, [i18n]);

  useEffect(() => {
    refreshOrders().catch((error) => Alert.alert("Orders", error.message));
  }, [refreshOrders]);

  async function signInWithEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new Error("Email is required.");
    }

    if (!supabase) {
      await storeLocalUser(makeLocalUser(normalizedEmail));
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: true
      }
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async function verifyEmail(email: string, token: string) {
    if (!supabase) {
      const localUser = makeLocalUser(email);
      await storeLocalUser(localUser);
      setUser(localUser);
      return;
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email"
    });

    if (error || !data.user?.email) {
      throw new Error(error?.message ?? "Email verification failed.");
    }

    const profile: TravioUser = {
      id: data.user.id,
      name: data.user.email.split("@")[0],
      email: data.user.email,
      phone: data.user.phone ?? undefined,
      created_at: data.user.created_at
    };
    await upsertUserProfile(profile);
    setUser(profile);
  }

  async function signInWithApple() {
    if (supabase && isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "apple" });
      if (error) {
        throw new Error(error.message);
      }
      return;
    }

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL
      ]
    });
    const email = credential.email ?? "apple-user@travio.local";
    const localUser = makeLocalUser(email, credential.fullName?.givenName ?? "Apple User");
    await storeLocalUser(localUser);
    setUser(localUser);
  }

  async function signInWithGoogle() {
    if (supabase && isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
      if (error) {
        throw new Error(error.message);
      }
      return;
    }

    const localUser = makeLocalUser("google-user@travio.local", "Google User");
    await storeLocalUser(localUser);
    setUser(localUser);
  }

  async function logout() {
    if (supabase) {
      await supabase.auth.signOut();
    }
    await clearLocalUser();
    setUser(null);
    setOrders([]);
  }

  async function completeOrder(draft: OrderDraft) {
    const activeUser = user ?? makeLocalUser("guest@travio.local", "Guest");
    if (!user) {
      await storeLocalUser(activeUser);
      setUser(activeUser);
    }

    const order = await saveOrder(activeUser.id, draft);
    setLatestOrder(order);
    setOrderDraft(null);
    setSelectedProduct(null);
    await refreshOrders();
    return order;
  }

  async function changeLanguage(nextLanguage: SupportedLanguage) {
    setLanguageState(nextLanguage);
    await AsyncStorage.setItem(LANGUAGE_KEY, nextLanguage);
    await i18n.changeLanguage(nextLanguage);
  }

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      loading,
      selectedProduct,
      orderDraft,
      latestOrder,
      orders,
      language,
      signInWithEmail,
      verifyEmail,
      signInWithApple,
      signInWithGoogle,
      logout,
      selectProduct: setSelectedProduct,
      setDraft: setOrderDraft,
      completeOrder,
      refreshOrders,
      setLanguage: changeLanguage
    }),
    [user, loading, selectedProduct, orderDraft, latestOrder, orders, language, refreshOrders]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
