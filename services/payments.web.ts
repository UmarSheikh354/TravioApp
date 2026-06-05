import type { OrderDraft } from "@/types/travio";

export function useTravioPayments() {
  async function pay(_draft: OrderDraft) {
    await new Promise((resolve) => setTimeout(resolve, 900));
    return { demo: true };
  }

  return { pay };
}
