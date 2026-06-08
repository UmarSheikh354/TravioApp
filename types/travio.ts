export type SupportedLanguage = "en" | "ur" | "ar";

export type Supplier = "Alibaba" | "Amazon" | "Temu" | "AliExpress" | "Google Shopping";

export type ProductOption = {
  id?: string;
  name: string;
  price_per_unit: number;
  total_price: number;
  delivery_days: number;
  supplier: Supplier;
  description: string;
  category?: string;
  image_url?: string;
  availability?: string;
  cashback_percent?: number;
  coupon?: string;
  price_history?: number[];
  product_url?: string;
  quality_score?: number;
  rating?: number;
  return_policy?: string;
  reviews_count?: number;
  seller_badge?: "new" | "trusted" | "verified";
  seller_rating?: number;
  seller_years_active?: number;
  safety_score?: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  products?: ProductOption[];
  createdAt: string;
};

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type CustomerDetails = {
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
};

export type OrderDraft = CustomerDetails & {
  product: ProductOption;
  quantity: number;
};

export type TravioOrder = {
  id: string;
  user_id: string;
  product_name: string;
  quantity: number;
  price_per_unit: number;
  total_price: number;
  supplier: Supplier;
  delivery_address: string;
  city: string;
  country: string;
  status: OrderStatus;
  created_at: string;
  tracking_number: string;
};

export type TravioUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  agreement_accepted_at?: string;
  created_at: string;
};

export type ApiResult<T> = {
  data?: T;
  error?: string;
};
