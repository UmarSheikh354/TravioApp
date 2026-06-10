import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AppleAuthentication from "expo-apple-authentication";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Platform as RNPlatform } from "react-native";
import { listSavedProducts, removeProduct, saveProduct } from "@/lib/db";
import { supabase } from "@/lib/supabase";
import type { Platform, Product, TravioUser, UserPreferences } from "@/types/travio";

const PREFS_KEY = "travio.preferences";
const LOCAL_USER_KEY = "travio.localUser";

export const DEFAULT_PREFERENCES: UserPreferences = {
  colorScheme: "system",
  hapticFeedback: true,
  voice: "Breeze",
  language: "Auto-Detect",
  marketplaces: { Amazon: true, AliExpress: true, Temu: true, Alibaba: true },
  customInstructions: "",
};

interface AppContextValue {
  user: TravioUser | null;
  initializing: boolean;
  preferences: UserPreferences;
  savedProducts: Product[];
  isProductSaved: (productId: string) => boolean;
  updatePreferences: (next: Partial<UserPreferences>) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  toggleSavedProduct: (product: Product) => Promise<void>;
  refreshSavedProducts: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function makeLocalUser(email: string, fullName: string | null): TravioUser {
  return {
    id: `local-${email.toLowerCase()}`,
    email,
    full_name: fullName,
    avatar_url: null,
    subscription_tier: "Free",
    preferences: null,
    created_at: new Date().toISOString(),
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TravioUser | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);

  const loadPreferences = useCallback(async () => {
    const raw = await AsyncStorage.getItem(PREFS_KEY);
    if (raw) {
      setPreferences({ ...DEFAULT_PREFERENCES, ...(JSON.parse(raw) as UserPreferences) });
    }
  }, []);

  const refreshSavedProducts = useCallback(async () => {
    if (!user) {
      setSavedProducts([]);
      return;
    }
    const products = await listSavedProducts(user.id);
    setSavedProducts(products);
  }, [user]);

  useEffect(() => {
    let active = true;
    async function bootstrap() {
      await loadPreferences();
      if (supabase) {
        const { data } = await supabase.auth.getSession();
        const sessionUser = data.session?.user;
        if (active && sessionUser) {
          setUser({
            id: sessionUser.id,
            email: sessionUser.email ?? "",
            full_name: (sessionUser.user_metadata?.full_name as string) ?? null,
            avatar_url: (sessionUser.user_metadata?.avatar_url as string) ?? null,
            subscription_tier: "Free",
            preferences: null,
            created_at: sessionUser.created_at ?? new Date().toISOString(),
          });
        }
      } else {
        const raw = await AsyncStorage.getItem(LOCAL_USER_KEY);
        if (active && raw) {
          setUser(JSON.parse(raw) as TravioUser);
        }
      }
      if (active) {
        setInitializing(false);
      }
    }
    bootstrap();
    return () => {
      active = false;
    };
  }, [loadPreferences]);

  useEffect(() => {
    refreshSavedProducts();
  }, [refreshSavedProducts]);

  const persistLocalUser = useCallback(async (next: TravioUser | null) => {
    if (next) {
      await AsyncStorage.setItem(LOCAL_USER_KEY, JSON.stringify(next));
    } else {
      await AsyncStorage.removeItem(LOCAL_USER_KEY);
    }
  }, []);

  const updatePreferences = useCallback(
    async (next: Partial<UserPreferences>) => {
      setPreferences((current) => {
        const merged = { ...current, ...next };
        AsyncStorage.setItem(PREFS_KEY, JSON.stringify(merged)).catch(() => {});
        return merged;
      });
    },
    [],
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string, fullName: string) => {
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (error) throw new Error(error.message);
        const created = data.user;
        if (created) {
          await supabase.from("users").upsert({
            id: created.id,
            email,
            full_name: fullName,
            subscription_tier: "Free",
            created_at: new Date().toISOString(),
          });
        }
        return;
      }
      const local = makeLocalUser(email, fullName);
      await persistLocalUser(local);
      setUser(local);
    },
    [persistLocalUser],
  );

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error(error.message);
        const sessionUser = data.user;
        if (sessionUser) {
          setUser({
            id: sessionUser.id,
            email: sessionUser.email ?? email,
            full_name: (sessionUser.user_metadata?.full_name as string) ?? null,
            avatar_url: (sessionUser.user_metadata?.avatar_url as string) ?? null,
            subscription_tier: "Free",
            preferences: null,
            created_at: sessionUser.created_at ?? new Date().toISOString(),
          });
        }
        return;
      }
      const local = makeLocalUser(email, null);
      await persistLocalUser(local);
      setUser(local);
    },
    [persistLocalUser],
  );

  const signInWithApple = useCallback(async () => {
    if (RNPlatform.OS !== "ios") {
      throw new Error("Apple Sign-In is only available on iOS devices.");
    }
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    const fullName = credential.fullName?.givenName ?? "Travio User";
    if (supabase && credential.identityToken) {
      const { error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken,
      });
      if (error) throw new Error(error.message);
      return;
    }
    const local = makeLocalUser(credential.email ?? "apple-user@travio.app", fullName);
    await persistLocalUser(local);
    setUser(local);
  }, [persistLocalUser]);

  const signInWithGoogle = useCallback(async () => {
    throw new Error(
      "Google Sign-In needs EXPO_PUBLIC_GOOGLE_CLIENT_ID configured in .env.",
    );
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    await persistLocalUser(null);
    setUser(null);
    setSavedProducts([]);
  }, [persistLocalUser]);

  const toggleSavedProduct = useCallback(
    async (product: Product) => {
      if (!user) return;
      const existing = savedProducts.find(
        (item) => item.id === product.id || item.product_url === product.product_url,
      );
      if (existing) {
        await removeProduct(existing.id);
      } else {
        await saveProduct(user.id, product);
      }
      await refreshSavedProducts();
    },
    [user, savedProducts, refreshSavedProducts],
  );

  const isProductSaved = useCallback(
    (productId: string) => savedProducts.some((item) => item.id === productId),
    [savedProducts],
  );

  const value = useMemo<AppContextValue>(
    () => ({
      user,
      initializing,
      preferences,
      savedProducts,
      isProductSaved,
      updatePreferences,
      signUpWithEmail,
      signInWithEmail,
      signInWithApple,
      signInWithGoogle,
      signOut,
      toggleSavedProduct,
      refreshSavedProducts,
    }),
    [
      user,
      initializing,
      preferences,
      savedProducts,
      isProductSaved,
      updatePreferences,
      signUpWithEmail,
      signInWithEmail,
      signInWithApple,
      signInWithGoogle,
      signOut,
      toggleSavedProduct,
      refreshSavedProducts,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export type { Platform };
