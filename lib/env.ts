import {
  ALIEXPRESS_APP_KEY,
  ALIEXPRESS_APP_SECRET,
  ALIEXPRESS_TRACKING_ID,
  AMAZON_ACCESS_KEY,
  AMAZON_PARTNER_TAG,
  AMAZON_SECRET_KEY,
  ANTHROPIC_API_KEY,
  ANTHROPIC_MODEL,
  PAYMENT_INTENT_ENDPOINT,
  RAPIDAPI_KEY,
  STRIPE_MERCHANT_ID,
  STRIPE_PUBLISHABLE_KEY,
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  TEMU_RAPIDAPI_HOST
} from "@env";

const PLACEHOLDER_MARKERS = ["your_key_here", "your_tag_here", "your_url_here", "your_host_here", "your_backend_here"];

function firstDefined(...values: Array<string | undefined>) {
  return values.find((value) => value && value.length > 0);
}

export const env = {
  supabaseUrl: firstDefined(SUPABASE_URL, process.env.EXPO_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: firstDefined(SUPABASE_ANON_KEY, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
  claudeApiKey: firstDefined(ANTHROPIC_API_KEY, process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY),
  claudeModel: firstDefined(ANTHROPIC_MODEL, process.env.EXPO_PUBLIC_ANTHROPIC_MODEL),
  aliexpressAppKey: firstDefined(ALIEXPRESS_APP_KEY, process.env.EXPO_PUBLIC_ALIEXPRESS_APP_KEY),
  aliexpressAppSecret: firstDefined(ALIEXPRESS_APP_SECRET, process.env.EXPO_PUBLIC_ALIEXPRESS_APP_SECRET),
  aliexpressTrackingId: firstDefined(ALIEXPRESS_TRACKING_ID, process.env.EXPO_PUBLIC_ALIEXPRESS_TRACKING_ID),
  amazonAccessKey: firstDefined(AMAZON_ACCESS_KEY, process.env.EXPO_PUBLIC_AMAZON_ACCESS_KEY),
  amazonSecretKey: firstDefined(AMAZON_SECRET_KEY, process.env.EXPO_PUBLIC_AMAZON_SECRET_KEY),
  amazonPartnerTag: firstDefined(AMAZON_PARTNER_TAG, process.env.EXPO_PUBLIC_AMAZON_PARTNER_TAG),
  amazonRegion: process.env.EXPO_PUBLIC_AMAZON_REGION ?? "us-east-1",
  temuRapidApiKey: firstDefined(RAPIDAPI_KEY, process.env.EXPO_PUBLIC_RAPIDAPI_KEY),
  temuRapidApiHost: firstDefined(TEMU_RAPIDAPI_HOST, process.env.EXPO_PUBLIC_TEMU_RAPIDAPI_HOST),
  stripePublishableKey: firstDefined(STRIPE_PUBLISHABLE_KEY, process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY),
  stripeMerchantId: firstDefined(STRIPE_MERCHANT_ID, process.env.EXPO_PUBLIC_STRIPE_MERCHANT_ID),
  paymentIntentEndpoint: firstDefined(PAYMENT_INTENT_ENDPOINT, process.env.EXPO_PUBLIC_PAYMENT_INTENT_ENDPOINT)
};

export function isConfigured(value?: string) {
  if (!value) {
    return false;
  }

  return !PLACEHOLDER_MARKERS.some((marker) => value.includes(marker));
}

export function missingConfigMessage(name: string) {
  return `${name} is not configured. Add the real value to .env and restart Expo.`;
}
