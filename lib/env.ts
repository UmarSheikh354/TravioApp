const PLACEHOLDER_MARKERS = ["your-", "example.com", "placeholder", "changeme"];

export const env = {
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  // Anthropic Claude key. Supports the spec name and the existing project name.
  claudeApiKey:
    process.env.ANTHROPIC_API_KEY ?? process.env.EXPO_PUBLIC_CLAUDE_API_KEY,
  // RapidAPI Real-Time Product Search. Falls back to the legacy Temu key/host.
  rapidApiKey:
    process.env.EXPO_PUBLIC_RAPIDAPI_KEY ??
    process.env.EXPO_PUBLIC_TEMU_RAPIDAPI_KEY,
  rapidApiHost:
    process.env.EXPO_PUBLIC_RAPIDAPI_HOST ??
    process.env.EXPO_PUBLIC_TEMU_RAPIDAPI_HOST ??
    "real-time-product-search.p.rapidapi.com",
  googleClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
} as const;

export function isConfigured(value?: string | null): value is string {
  if (!value) {
    return false;
  }

  return !PLACEHOLDER_MARKERS.some((marker) => value.includes(marker));
}
