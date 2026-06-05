# Travio Play Store Release Checklist

This project is configured for Expo/EAS Android builds. Use Expo Go only for early UI testing; Play Store testing must use an APK/AAB produced by EAS because the production app includes native modules such as Stripe.

## Build commands

Run these before every release candidate:

```bash
npm run doctor
npm run typecheck
npm run lint
```

Create an internal testing APK:

```bash
npm run build:android:preview
```

Create a Play Store AAB:

```bash
npm run build:android:production
```

Submit after the AAB passes internal testing:

```bash
npm run submit:android
```

## Required production configuration

The app will not be production-ready until these are real and tested:

- Supabase URL and anon key.
- Supabase schema from `supabase/schema.sql` applied in the Supabase project.
- Stripe publishable key plus a secure backend PaymentIntent endpoint.
- Anthropic API access through a secure backend proxy. Do not ship long-lived Anthropic secret keys inside a public mobile app.
- Marketplace search through secure backend endpoints for Amazon PAAPI, AliExpress signing, and RapidAPI/Temu. Do not ship provider secret keys inside the app.
- Google Play app signing enabled in Play Console.
- Store listing graphics, screenshots, support email, public privacy policy URL, and data safety form.

## Current app behavior during testing

- Expo Go uses demo payment mode because Expo Go cannot load Stripe native PaymentSheet.
- Custom development and EAS builds use Stripe PaymentSheet when Stripe and the PaymentIntent endpoint are configured.
- Placeholder API values trigger demo/fallback data so the product flow remains testable before all accounts are connected.

## Android package details

- Package name: `com.travio.app`
- Version name: `1.0.0`
- Version code: `1`
- Production build output: Android App Bundle (`.aab`)

Increment `android.versionCode` for each Play Store upload if EAS auto-increment is not used.
