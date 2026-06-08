# Travio

Travio is a React Native Expo app that lets a user describe a product, receives AI-powered supplier options, confirms an order, pays with Stripe, and stores the order in Supabase.

## Features

- Expo Router navigation
- Splash screen, onboarding, login, email verification, home, AI chat, order form, payment, success, order history, and profile screens
- Claude API integration using `claude-sonnet-4-20250514`
- Alibaba/AliExpress, Amazon Product Advertising, and Temu RapidAPI search adapters
- Product cards with exactly three supplier options
- Stripe PaymentSheet support for cards, Apple Pay, and Google Pay
- Supabase users, products, and orders persistence
- Expo push notification registration and local order update notifications
- English, Urdu, and Arabic translations
- `.env` placeholders for every external service using the requested Travio key names
- Legal agreement gating with Privacy Policy and Terms screens

## Setup

```bash
npm install
npm start
```

Replace the placeholder values in `.env` with real API credentials before testing live Claude, marketplace, Stripe, and Supabase flows.

## Android release

See `docs/PLAY_STORE_RELEASE.md` for EAS build commands, Play Store release steps, and the required production configuration checklist.

## Database

Run `supabase/schema.sql` in the Supabase SQL editor to create:

- `users (id, name, email, phone, address, agreement_accepted_at, created_at)`
- `orders (id, user_id, product_name, quantity, price_per_unit, total_price, supplier, delivery_address, city, country, status, tracking_number, created_at)`
- `products (id, name, price, supplier, delivery_days, image_url, category)`

## Notes

The app includes a local demo fallback when API credentials are placeholders so the flow can be exercised before backend keys are available. Production marketplace and payment flows should use signed server-side endpoints where provider policies require secret keys, especially Amazon PAAPI, AliExpress signing, Anthropic, and Stripe PaymentIntent creation.
