import { StripeProvider } from "@stripe/stripe-react-native";
import type { ReactElement } from "react";
import { env } from "@/lib/env";

type Props = {
  children: ReactElement | ReactElement[];
};

export function TravioStripeProvider({ children }: Props) {
  return (
    <StripeProvider
      publishableKey={env.stripePublishableKey ?? "pk_test_placeholder"}
      merchantIdentifier={env.stripeMerchantId ?? "merchant.com.travio.app"}
    >
      {children}
    </StripeProvider>
  );
}
