const PLACEHOLDER_MARKERS = ["your-", "example.com", "temu-api-host-from-rapidapi"];

export const env = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  claudeApiKey: process.env.EXPO_PUBLIC_CLAUDE_API_KEY,
  aliexpressAppKey: process.env.EXPO_PUBLIC_ALIEXPRESS_APP_KEY,
  aliexpressAppSecret: process.env.EXPO_PUBLIC_ALIEXPRESS_APP_SECRET,
  aliexpressTrackingId: process.env.EXPO_PUBLIC_ALIEXPRESS_TRACKING_ID,
  amazonAccessKey: process.env.EXPO_PUBLIC_AMAZON_ACCESS_KEY,
  amazonSecretKey: process.env.EXPO_PUBLIC_AMAZON_SECRET_KEY,
  amazonAssociateTag: process.env.EXPO_PUBLIC_AMAZON_ASSOCIATE_TAG,
  amazonRegion: process.env.EXPO_PUBLIC_AMAZON_REGION ?? "us-east-1",
  temuRapidApiKey: process.env.EXPO_PUBLIC_TEMU_RAPIDAPI_KEY,
  temuRapidApiHost: process.env.EXPO_PUBLIC_TEMU_RAPIDAPI_HOST,
  stripePublishableKey: process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  stripeMerchantId: process.env.EXPO_PUBLIC_STRIPE_MERCHANT_ID,
  paymentIntentEndpoint: process.env.EXPO_PUBLIC_PAYMENT_INTENT_ENDPOINT
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
