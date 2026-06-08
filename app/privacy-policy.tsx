import { StyleSheet, Text } from "react-native";
import { Screen } from "@/components/Screen";

const PRIVACY_POLICY = `Privacy Policy — Travio
Last updated: June 2026

Information We Collect
We collect information you provide when creating an account including name, email address, phone number and delivery address. We also collect order history, payment information processed securely through Stripe, and device information for app functionality.
How We Use Your Information
We use your information to process and deliver your orders, send order status notifications, improve our AI recommendations, provide customer support, and send promotional offers only if you opt in.
Information Sharing
We do not sell your personal information. We share data only with trusted partners required to fulfill your orders including Stripe for payments, Supabase for secure data storage, and delivery partners. All partners are bound by strict confidentiality agreements.
Data Security
Your data is encrypted in transit and at rest. Payment information is never stored on our servers — it is handled entirely by Stripe which is PCI DSS compliant. We use industry standard security measures to protect your information.
Your Rights
You may access, update or delete your personal information at any time through the Profile screen. You may also request complete data deletion by contacting us at privacy@travio.ai
Cookies and Tracking
We use analytics to improve app performance. We do not track you across other apps or websites. You can opt out of analytics in your Profile settings.
Children's Privacy
Travio is not intended for users under 13 years of age. We do not knowingly collect information from children.
Changes to This Policy
We may update this policy and will notify you through the app. Continued use after changes means you accept the updated policy.
Contact Us
For privacy questions contact: privacy@travio.ai`;

export default function PrivacyPolicyScreen() {
  return (
    <Screen>
      <Text style={styles.content}>{PRIVACY_POLICY}</Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    color: "#d7deee",
    fontSize: 16,
    lineHeight: 25
  }
});
