import * as Haptics from "expo-haptics";
import { useCallback, useRef, useState } from "react";
import { createChat, saveMessage, setMessageFeedback } from "@/lib/db";
import { askTravio } from "@/services/claude";
import { searchProducts, shouldSearchProducts } from "@/services/productSearch";
import type { ChatMessage, Feedback, Product, TravioUser } from "@/types/travio";

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useChat(user: TravioUser | null, hapticsEnabled: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const chatIdRef = useRef<string | null>(null);

  const reset = useCallback(() => {
    setMessages([]);
    chatIdRef.current = null;
  }, []);

  const ensureChat = useCallback(
    async (firstMessage: string) => {
      if (chatIdRef.current || !user) {
        return chatIdRef.current;
      }
      const title = firstMessage.slice(0, 40) || "New chat";
      const chat = await createChat(user.id, title);
      chatIdRef.current = chat.id;
      return chat.id;
    },
    [user],
  );

  const streamReveal = useCallback(
    (messageId: string, fullText: string, products?: Product[]) =>
      new Promise<void>((resolve) => {
        const words = fullText.split(" ");
        let shown = 0;
        const interval = setInterval(() => {
          shown += 1;
          const partial = words.slice(0, shown).join(" ");
          setMessages((current) =>
            current.map((message) =>
              message.id === messageId
                ? { ...message, content: partial, streaming: shown < words.length }
                : message,
            ),
          );
          if (shown >= words.length) {
            clearInterval(interval);
            setMessages((current) =>
              current.map((message) =>
                message.id === messageId
                  ? { ...message, content: fullText, products, streaming: false }
                  : message,
              ),
            );
            resolve();
          }
        }, 35);
      }),
    [],
  );

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) {
        return;
      }

      if (hapticsEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }

      const userMessage: ChatMessage = {
        id: makeId(),
        role: "user",
        content: trimmed,
        created_at: new Date().toISOString(),
      };

      const history = [...messages, userMessage];
      setMessages(history);
      setLoading(true);

      const chatId = await ensureChat(trimmed);
      await saveMessage({ ...userMessage, chat_id: chatId ?? undefined, user_id: user?.id });

      let products: Product[] | undefined;
      if (shouldSearchProducts(trimmed)) {
        products = await searchProducts(trimmed);
      }

      const replyText = await askTravio(history);
      const assistantId = makeId();
      const assistantMessage: ChatMessage = {
        id: assistantId,
        role: "assistant",
        content: "",
        created_at: new Date().toISOString(),
        streaming: true,
      };
      setMessages((current) => [...current, assistantMessage]);
      setLoading(false);

      await streamReveal(assistantId, replyText, products);
      await saveMessage({
        ...assistantMessage,
        content: replyText,
        products,
        streaming: false,
        chat_id: chatId ?? undefined,
        user_id: user?.id,
      });
    },
    [loading, messages, hapticsEnabled, ensureChat, user, streamReveal],
  );

  const regenerate = useCallback(async () => {
    const lastUser = [...messages].reverse().find((message) => message.role === "user");
    if (!lastUser) {
      return;
    }
    setMessages((current) => {
      const lastAssistantIndex = current.map((m) => m.role).lastIndexOf("assistant");
      if (lastAssistantIndex === -1) {
        return current;
      }
      return current.slice(0, lastAssistantIndex);
    });
    await send(lastUser.content);
  }, [messages, send]);

  const updateFeedback = useCallback((messageId: string, feedback: Feedback) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === messageId
          ? { ...message, feedback: message.feedback === feedback ? null : feedback }
          : message,
      ),
    );
    setMessageFeedback(messageId, feedback).catch(() => {});
  }, []);

  return { messages, loading, send, regenerate, updateFeedback, reset, setMessages };
}
