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
  signInWithEmail: (email: string, agreementAcceptedAt: string) => Promise<void>;
  verifyEmail: (email: string, token: string, agreementAcceptedAt: string) => Promise<void>;
  signInWithApple: (agreementAcceptedAt: string) => Promise<void>;
  signInWithGoogle: (agreementAcceptedAt: string) => Promise<void>;
  signInWithGoogleIdToken: (idToken: string, agreementAcceptedAt: string) => Promise<void>;
  logout: () => Promise<void>;
  selectProduct: (product: ProductOption) => void;
  setDraft: (draft: OrderDraft) => void;
  completeOrder: (draft: OrderDraft) => Promise<TravioOrder>;
  refreshOrders: () => Promise<void>;
  setLanguage: (language: SupportedLanguage) => Promise<void>;
};

const LANGUAGE_KEY = "travio.language";
const PENDING_AGREEMENT_KEY = "travio.pendingAgreementAcceptedAt";
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
            const pendingAgreementAcceptedAt = await AsyncStorage.getItem(PENDING_AGREEMENT_KEY);
            const profile: TravioUser = {
              id: data.user.id,
              name: data.user.user_metadata?.name ?? data.user.email.split("@")[0],
              email: data.user.email,
              phone: data.user.phone ?? undefined,
              agreement_accepted_at:
                (data.user.user_metadata?.agreement_accepted_at as string | undefined) ?? pendingAgreementAcceptedAt ?? undefined,
              created_at: data.user.created_at
            };
            setUser(profile);
            await upsertUserProfile(profile);
            await AsyncStorage.removeItem(PENDING_AGREEMENT_KEY);
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

  async function signInWithEmail(email: string, agreementAcceptedAt: string) {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new Error("Email is required.");
    }

    if (!supabase) {
      await storeLocalUser(makeLocalUser(normalizedEmail, "Travio User", agreementAcceptedAt));
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
      options: {
        shouldCreateUser: true,
        data: {
          agreement_accepted_at: agreementAcceptedAt
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }
  }

  async function verifyEmail(email: string, token: string, agreementAcceptedAt: string) {
    if (!supabase) {
      const localUser = makeLocalUser(email, "Travio User", agreementAcceptedAt);
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
      agreement_accepted_at: agreementAcceptedAt,
      created_at: data.user.created_at
    };
    await upsertUserProfile(profile);
    setUser(profile);
  }

  async function signInWithApple(agreementAcceptedAt: string) {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL
      ]
    });
    const email = credential.email ?? "apple-user@travio.local";
    const name = credential.fullName?.givenName ?? "Apple User";

    if (supabase && isSupabaseConfigured && credential.identityToken) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken
      });

      if (error) {
        throw new Error(error.message);
      }

      const profile = makeLocalUser(data.user?.email ?? email, name, agreementAcceptedAt);
      const supabaseProfile: TravioUser = {
        ...profile,
        id: data.user?.id ?? profile.id,
        created_at: data.user?.created_at ?? profile.created_at
      };
      await upsertUserProfile(supabaseProfile);
      setUser(supabaseProfile);
      return;
    }

    const localUser = makeLocalUser(email, name, agreementAcceptedAt);
    await storeLocalUser(localUser);
    setUser(localUser);
  }

  async function signInWithGoogle(agreementAcceptedAt: string) {
    if (supabase && isSupabaseConfigured) {
      await AsyncStorage.setItem(PENDING_AGREEMENT_KEY, agreementAcceptedAt);
      const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
      if (error) {
        throw new Error(error.message);
      }
      return;
    }

    const localUser = makeLocalUser("google-user@travio.local", "Google User", agreementAcceptedAt);
    await storeLocalUser(localUser);
    setUser(localUser);
  }

  async function signInWithGoogleIdToken(idToken: string, agreementAcceptedAt: string) {
    if (supabase && isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "google",
        token: idToken
      });

      if (error) {
        throw new Error(error.message);
      }

      const email = data.user?.email ?? "google-user@travio.local";
      const profile: TravioUser = {
        id: data.user?.id ?? `local-${email}`,
        name: data.user?.user_metadata?.name ?? email.split("@")[0],
        email,
        agreement_accepted_at: agreementAcceptedAt,
        created_at: data.user?.created_at ?? new Date().toISOString()
      };
      await upsertUserProfile(profile);
      setUser(profile);
      return;
    }

    const localUser = makeLocalUser("google-user@travio.local", "Google User", agreementAcceptedAt);
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
    setOrders((current) => [order, ...current.filter((item) => item.id !== order.id)]);
    if (user) {
      await refreshOrders();
    }
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
      signInWithGoogleIdToken,
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
