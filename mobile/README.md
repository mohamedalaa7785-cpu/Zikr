# ZIKR mobile runtime

This repository keeps one Next.js codebase and runs the production web app inside Capacitor for Android and iOS. The canonical web deployment remains `https://zikrmediaofficial.vercel.app`; native shells use that origin so SSR, API routes, Supabase auth callbacks, SEO, sitemap, robots, PWA and Vercel deployment behavior stay intact.

## Required store values

- Android package: `com.zikr.app`
- iOS bundle id: `com.zikr.app`
- App name: `ZIKR | ذِكرٌ`
- Custom scheme redirect: `com.zikr.app://auth/callback`
- HTTPS redirect: `https://zikrmediaofficial.vercel.app/auth/callback`
- Associated domain / app link host: `zikrmediaofficial.vercel.app`

## Supabase / Google OAuth redirect URLs

Add all URLs below in Supabase Auth URL configuration and Google OAuth clients:

```text
https://zikrmediaofficial.vercel.app/auth/callback
com.zikr.app://auth/callback
com.zikr.app://login-callback
```

## Native capability checklist

Capacitor configuration enables splash screen, status bar, keyboard, local notifications, push notification presentation, app links, universal links, deep links, camera, filesystem, share, network, preferences-backed secure-ish local settings, haptics and background-task extension points. Hardware-backed secrets and biometrics should be connected to `@capacitor-community/biometric-auth` during native dependency installation.

## Build sequence

```bash
pnpm install
pnpm build
pnpm cap sync android
pnpm cap sync ios
npx cap open android
npx cap open ios
```

Provision release signing in Android Studio / Xcode; do not commit keystores, provisioning profiles, or App Store Connect API keys.
