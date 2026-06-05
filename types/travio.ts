export type SupportedLanguage = "en" | "ur" | "ar";

export type Supplier = "Alibaba" | "Amazon" | "Temu";

export type ProductOption = {
  id?: string;
  name: string;
  price_per_unit: number;
  total_price: number;
  delivery_days: number;
  supplier: Supplier;
  description: string;
  image_url?: string;
  availability?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  products?: ProductOption[];
  createdAt: string;
};

export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";

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
  price: number;
  supplier: Supplier;
  address: string;
  status: OrderStatus;
  created_at: string;
  tracking_number: string;
};

export type TravioUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
};

export type ApiResult<T> = {
  data?: T;
  error?: string;
};
