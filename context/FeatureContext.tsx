import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import type { ProductOption } from "@/types/travio";

export type CartItem = {
  product: ProductOption;
  quantity: number;
};

export type ShoppingPreferences = {
  blockedSellers: string[];
  budgetLimit: number;
  categories: string[];
  favoriteBrands: string[];
  marketplaceEnabled: Record<string, boolean>;
  privacyMode: boolean;
  styleProfile: string;
  homeProfile: string;
  techProfile: string;
};

type FeatureContextValue = {
  cart: CartItem[];
  preferences: ShoppingPreferences;
  trackedProducts: ProductOption[];
  wishlist: ProductOption[];
  addToCart: (product: ProductOption, quantity?: number) => Promise<void>;
  addToWishlist: (product: ProductOption) => Promise<void>;
  clearCart: () => Promise<void>;
  isSaved: (product: ProductOption) => boolean;
  removeFromWishlist: (productId?: string) => Promise<void>;
  trackPrice: (product: ProductOption) => Promise<void>;
  updatePreferences: (preferences: Partial<ShoppingPreferences>) => Promise<void>;
};

const FEATURE_STATE_KEY = "travio.feature.state";

const defaultPreferences: ShoppingPreferences = {
  blockedSellers: [],
  budgetLimit: 500,
  categories: ["Electronics", "Fashion", "Home"],
  favoriteBrands: [],
  marketplaceEnabled: {
    Amazon: true,
    Alibaba: true,
    AliExpress: true,
    Temu: true
  },
  privacyMode: false,
  styleProfile: "Minimal",
  homeProfile: "Modern",
  techProfile: "Balanced specs"
};

const FeatureContext = createContext<FeatureContextValue | undefined>(undefined);

export function FeatureProvider({ children }: PropsWithChildren) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [preferences, setPreferences] = useState<ShoppingPreferences>(defaultPreferences);
  const [trackedProducts, setTrackedProducts] = useState<ProductOption[]>([]);
  const [wishlist, setWishlist] = useState<ProductOption[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(FEATURE_STATE_KEY)
      .then((raw) => {
        if (!raw) {
          return;
        }
        const parsed = JSON.parse(raw) as Partial<{
          cart: CartItem[];
          preferences: ShoppingPreferences;
          trackedProducts: ProductOption[];
          wishlist: ProductOption[];
        }>;
        setCart(parsed.cart ?? []);
        setPreferences({ ...defaultPreferences, ...parsed.preferences });
        setTrackedProducts(parsed.trackedProducts ?? []);
        setWishlist(parsed.wishlist ?? []);
      })
      .catch(() => undefined);
  }, []);

  async function persist(nextState: {
    cart?: CartItem[];
    preferences?: ShoppingPreferences;
    trackedProducts?: ProductOption[];
    wishlist?: ProductOption[];
  }) {
    const state = {
      cart: nextState.cart ?? cart,
      preferences: nextState.preferences ?? preferences,
      trackedProducts: nextState.trackedProducts ?? trackedProducts,
      wishlist: nextState.wishlist ?? wishlist
    };
    await AsyncStorage.setItem(FEATURE_STATE_KEY, JSON.stringify(state));
  }

  async function addToCart(product: ProductOption, quantity = 1) {
    const nextCart = [...cart];
    const index = nextCart.findIndex((item) => item.product.id === product.id || item.product.name === product.name);
    if (index >= 0) {
      nextCart[index] = { ...nextCart[index], quantity: nextCart[index].quantity + quantity };
    } else {
      nextCart.unshift({ product, quantity });
    }
    setCart(nextCart);
    await persist({ cart: nextCart });
  }

  async function addToWishlist(product: ProductOption) {
    if (wishlist.some((item) => item.id === product.id || item.name === product.name)) {
      return;
    }
    const nextWishlist = [product, ...wishlist];
    setWishlist(nextWishlist);
    await persist({ wishlist: nextWishlist });
  }

  async function clearCart() {
    setCart([]);
    await persist({ cart: [] });
  }

  function isSaved(product: ProductOption) {
    return wishlist.some((item) => item.id === product.id || item.name === product.name);
  }

  async function removeFromWishlist(productId?: string) {
    const nextWishlist = wishlist.filter((product) => product.id !== productId);
    setWishlist(nextWishlist);
    await persist({ wishlist: nextWishlist });
  }

  async function trackPrice(product: ProductOption) {
    const nextTracked = trackedProducts.some((item) => item.id === product.id || item.name === product.name)
      ? trackedProducts
      : [product, ...trackedProducts];
    setTrackedProducts(nextTracked);
    await persist({ trackedProducts: nextTracked });
  }

  async function updatePreferences(nextPreferences: Partial<ShoppingPreferences>) {
    const merged = { ...preferences, ...nextPreferences };
    setPreferences(merged);
    await persist({ preferences: merged });
  }

  const value = useMemo<FeatureContextValue>(
    () => ({
      cart,
      preferences,
      trackedProducts,
      wishlist,
      addToCart,
      addToWishlist,
      clearCart,
      isSaved,
      removeFromWishlist,
      trackPrice,
      updatePreferences
    }),
    [cart, preferences, trackedProducts, wishlist]
  );

  return <FeatureContext.Provider value={value}>{children}</FeatureContext.Provider>;
}

export function useFeatures() {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error("useFeatures must be used within FeatureProvider");
  }
  return context;
}
