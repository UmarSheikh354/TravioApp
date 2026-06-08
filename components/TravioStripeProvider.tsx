import type { ComponentType, ReactElement } from "react";
import { env, isConfigured } from "@/lib/env";
import { isExpoGo } from "@/lib/runtime";

type Props = {
  children: ReactElement | ReactElement[];
};

type StripeProviderProps = {
  children: ReactElement | ReactElement[];
  merchantIdentifier: string;
  publishableKey: string;
};

export function TravioStripeProvider({ children }: Props) {
  const publishableKey = env.stripePublishableKey;

  if (isExpoGo() || !publishableKey || !isConfigured(publishableKey)) {
    return <>{children}</>;
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { StripeProvider } = require("@stripe/stripe-react-native") as {
    StripeProvider: ComponentType<StripeProviderProps>;
  };

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier={env.stripeMerchantId ?? "merchant.com.travio.app"}
    >
      {children}
    </StripeProvider>
  );
}
