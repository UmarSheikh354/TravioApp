import { env, isConfigured, missingConfigMessage } from "@/lib/env";
import { isExpoGo } from "@/lib/runtime";
import type { OrderDraft } from "@/types/travio";

type PaymentIntentResponse = {
  paymentIntent: string;
  ephemeralKey?: string;
  customer?: string;
};

type StripePaymentFunctions = {
  initPaymentSheet: (params: Record<string, unknown>) => Promise<{ error?: { message: string } }>;
  presentPaymentSheet: () => Promise<{ error?: { message: string } }>;
};

export function useTravioPayments() {
  async function createPaymentIntent(draft: OrderDraft): Promise<PaymentIntentResponse> {
    if (!isConfigured(env.paymentIntentEndpoint)) {
      throw new Error(missingConfigMessage("Stripe PaymentIntent endpoint"));
    }

    const response = await fetch(env.paymentIntentEndpoint!, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        amount: Math.round(draft.product.price_per_unit * draft.quantity * 100),
        currency: "usd",
        product: draft.product,
        customer: {
          name: draft.name,
          phone: draft.phone,
          address: draft.address,
          city: draft.city,
          country: draft.country
        }
      })
    });

    if (!response.ok) {
      throw new Error(`PaymentIntent endpoint failed with ${response.status}.`);
    }

    return response.json();
  }

  async function pay(draft: OrderDraft) {
    if (isExpoGo() || !isConfigured(env.stripePublishableKey) || !isConfigured(env.paymentIntentEndpoint)) {
      await new Promise((resolve) => setTimeout(resolve, 900));
      return { demo: true };
    }

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const stripe = require("@stripe/stripe-react-native") as StripePaymentFunctions;
    const intent = await createPaymentIntent(draft);
    const init = await stripe.initPaymentSheet({
      merchantDisplayName: "Travio",
      customerId: intent.customer,
      customerEphemeralKeySecret: intent.ephemeralKey,
      paymentIntentClientSecret: intent.paymentIntent,
      allowsDelayedPaymentMethods: true,
      applePay: {
        merchantCountryCode: "US"
      },
      googlePay: {
        merchantCountryCode: "US",
        testEnv: true
      },
      defaultBillingDetails: {
        name: draft.name,
        phone: draft.phone,
        address: {
          line1: draft.address,
          city: draft.city,
          country: draft.country
        }
      }
    });

    if (init.error) {
      throw new Error(init.error.message);
    }

    const presented = await stripe.presentPaymentSheet();
    if (presented.error) {
      throw new Error(presented.error.message);
    }

    return { demo: false };
  }

  return { pay };
}
