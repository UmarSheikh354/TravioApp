import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";
import type { Chat, ChatMessage, Product } from "@/types/travio";

const CHATS_KEY = "travio.chats";
const MESSAGES_KEY = "travio.messages";
const PRODUCTS_KEY = "travio.savedProducts";

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

async function readLocal<T>(key: string): Promise<T[]> {
  const raw = await AsyncStorage.getItem(key);
  return raw ? (JSON.parse(raw) as T[]) : [];
}

async function writeLocal<T>(key: string, value: T[]) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function createChat(userId: string, title: string): Promise<Chat> {
  const now = new Date().toISOString();
  const chat: Chat = {
    id: makeId(),
    user_id: userId,
    title,
    created_at: now,
    updated_at: now,
    is_archived: false,
  };

  if (supabase) {
    const { data, error } = await supabase
      .from("chats")
      .insert(chat)
      .select()
      .single();
    if (!error && data) {
      return data as Chat;
    }
  }

  const chats = await readLocal<Chat>(CHATS_KEY);
  await writeLocal(CHATS_KEY, [chat, ...chats]);
  return chat;
}

export async function listChats(userId: string): Promise<Chat[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (!error && data) {
      return data as Chat[];
    }
  }

  const chats = await readLocal<Chat>(CHATS_KEY);
  return chats.filter((chat) => chat.user_id === userId);
}

export async function renameChat(chatId: string, title: string): Promise<void> {
  const updated_at = new Date().toISOString();
  if (supabase) {
    await supabase.from("chats").update({ title, updated_at }).eq("id", chatId);
  }
  const chats = await readLocal<Chat>(CHATS_KEY);
  await writeLocal(
    CHATS_KEY,
    chats.map((chat) =>
      chat.id === chatId ? { ...chat, title, updated_at } : chat,
    ),
  );
}

export async function archiveChat(chatId: string): Promise<void> {
  if (supabase) {
    await supabase.from("chats").update({ is_archived: true }).eq("id", chatId);
  }
  const chats = await readLocal<Chat>(CHATS_KEY);
  await writeLocal(
    CHATS_KEY,
    chats.map((chat) =>
      chat.id === chatId ? { ...chat, is_archived: true } : chat,
    ),
  );
}

export async function saveMessage(message: ChatMessage): Promise<void> {
  const payload = {
    id: message.id,
    chat_id: message.chat_id,
    user_id: message.user_id ?? null,
    role: message.role,
    content: message.content,
    metadata: { products: message.products ?? [] },
    feedback: message.feedback ?? null,
    created_at: message.created_at,
  };

  if (supabase) {
    await supabase.from("messages").upsert(payload);
  }

  const messages = await readLocal<ChatMessage>(MESSAGES_KEY);
  const next = messages.filter((item) => item.id !== message.id);
  await writeLocal(MESSAGES_KEY, [...next, message]);
}

export async function listMessages(chatId: string): Promise<ChatMessage[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });
    if (!error && data) {
      return (data as Record<string, unknown>[]).map((row) => ({
        id: String(row.id),
        chat_id: String(row.chat_id),
        user_id: row.user_id ? String(row.user_id) : null,
        role: row.role as ChatMessage["role"],
        content: String(row.content ?? ""),
        products:
          ((row.metadata as { products?: Product[] } | null)?.products) ?? [],
        feedback: (row.feedback as ChatMessage["feedback"]) ?? null,
        created_at: String(row.created_at),
      }));
    }
  }

  const messages = await readLocal<ChatMessage>(MESSAGES_KEY);
  return messages
    .filter((message) => message.chat_id === chatId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export async function setMessageFeedback(
  messageId: string,
  feedback: ChatMessage["feedback"],
): Promise<void> {
  if (supabase) {
    await supabase.from("messages").update({ feedback }).eq("id", messageId);
  }
  const messages = await readLocal<ChatMessage>(MESSAGES_KEY);
  await writeLocal(
    MESSAGES_KEY,
    messages.map((message) =>
      message.id === messageId ? { ...message, feedback } : message,
    ),
  );
}

export async function saveProduct(
  userId: string,
  product: Product,
): Promise<Product> {
  const record: Product = {
    ...product,
    id: product.id || makeId(),
    user_id: userId,
    saved_at: new Date().toISOString(),
  };

  if (supabase) {
    await supabase.from("products").upsert({
      id: record.id,
      user_id: userId,
      title: record.title,
      price: record.price,
      currency: record.currency,
      image_url: record.image_url,
      product_url: record.product_url,
      platform: record.platform,
      rating: record.rating,
      saved_at: record.saved_at,
    });
  }

  const products = await readLocal<Product>(PRODUCTS_KEY);
  const next = products.filter((item) => item.id !== record.id);
  await writeLocal(PRODUCTS_KEY, [record, ...next]);
  return record;
}

export async function listSavedProducts(userId: string): Promise<Product[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("user_id", userId)
      .order("saved_at", { ascending: false });
    if (!error && data) {
      return data as Product[];
    }
  }

  const products = await readLocal<Product>(PRODUCTS_KEY);
  return products.filter((product) => product.user_id === userId);
}

export async function removeProduct(productId: string): Promise<void> {
  if (supabase) {
    await supabase.from("products").delete().eq("id", productId);
  }
  const products = await readLocal<Product>(PRODUCTS_KEY);
  await writeLocal(
    PRODUCTS_KEY,
    products.filter((product) => product.id !== productId),
  );
}
