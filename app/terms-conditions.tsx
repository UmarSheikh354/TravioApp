import { StyleSheet, Text } from "react-native";
import { Screen } from "@/components/Screen";

const TERMS = `Terms and Conditions — Travio
Last updated: June 2026

Acceptance of Terms
By downloading or using Travio you agree to these Terms. If you do not agree do not use the app.
Description of Service
Travio is an AI-powered commerce platform that helps users discover and order products from global suppliers including Alibaba, Amazon and Temu. We act as an intermediary between buyers and suppliers.
User Accounts
You must provide accurate information when creating an account. You are responsible for maintaining the security of your account. You must be at least 18 years old to use Travio.
Orders and Payments
All prices shown are estimates and may vary. Final prices are confirmed before payment. Payments are processed securely through Stripe. Once an order is placed cancellation may not be possible if production has started.
Delivery and Shipping
Delivery times are estimates provided by suppliers and are not guaranteed. International orders may be subject to customs duties which are the buyer's responsibility. We are not responsible for delays caused by customs, weather or carrier issues.
Refunds and Returns
Refund eligibility depends on the supplier's policy. Custom or personalized products generally cannot be returned. Contact support@travio.ai within 7 days of delivery for refund requests. We will mediate between you and the supplier.
AI Recommendations
Our AI provides product recommendations based on your requests. We do not guarantee the accuracy of AI-generated information. Always review order details carefully before confirming.
Prohibited Use
You may not use Travio for illegal purchases, reselling without permission, fraudulent orders, or any activity that violates local laws.
Limitation of Liability
Travio is not liable for supplier errors, product quality issues, delivery delays, or losses exceeding the amount paid for your order. We facilitate orders but do not manufacture or ship products directly.
Governing Law
These terms are governed by the laws of Pakistan. Disputes will be resolved in courts of Karachi, Pakistan.
Contact
For support: support@travio.ai
For legal matters: legal@travio.ai`;

export default function TermsConditionsScreen() {
  return (
    <Screen>
      <Text style={styles.content}>{TERMS}</Text>
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
