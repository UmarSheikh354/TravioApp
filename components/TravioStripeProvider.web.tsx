import type { ReactElement } from "react";

type Props = {
  children: ReactElement | ReactElement[];
};

export function TravioStripeProvider({ children }: Props) {
  return <>{children}</>;
}
