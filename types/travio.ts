export type Platform = "Amazon" | "AliExpress" | "Temu" | "Alibaba";

export type MessageRole = "user" | "assistant";

export type Feedback = "up" | "down" | null;

export interface TravioUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: string | null;
  preferences: UserPreferences | null;
  created_at: string;
}

export interface UserPreferences {
  colorScheme?: "system" | "light" | "dark";
  hapticFeedback?: boolean;
  voice?: string;
  language?: string;
  marketplaces?: Record<Platform, boolean>;
  customInstructions?: string;
}

export interface Product {
  id: string;
  user_id?: string | null;
  title: string;
  price: number;
  currency: string;
  image_url: string | null;
  product_url: string | null;
  platform: Platform;
  rating: number | null;
  saved_at?: string;
}

export interface ChatMessage {
  id: string;
  chat_id?: string;
  user_id?: string | null;
  role: MessageRole;
  content: string;
  products?: Product[];
  feedback?: Feedback;
  created_at: string;
  streaming?: boolean;
}

export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
}
