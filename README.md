# News message chat

Mobile-first white-and-blue chat app starter, prepared for an Android APK build with Capacitor.

## Current status

This repository currently contains a **front-end prototype**, not a production messaging service. It includes sample chat rows, local in-page message composition, navigation for stories/calls/groups/account, and a sample plan display.

Not yet implemented: real accounts/email verification, shared real-time messages, message persistence across devices, image/audio uploads, stories, group membership, voice/video calling, push notifications, secure admin tools, or real payment processing. The plan display (free 1 hour; 4 hours for ฿4) is informational only. Do not collect payments until a backend, payment provider, verified webhook, and refund/support rules are configured.

## Build Android APK with GitHub Actions

1. Open the **Actions** tab in this repository.
2. Enable Actions if GitHub asks.
3. Run **Build Android APK** using **Run workflow**, or push a commit to the main branch.
4. When the workflow completes successfully, open its run and download the `news-message-chat-debug-apk` artifact.
5. Install the APK on an Android test device. A debug APK is for testing, not Play Store release.

The workflow installs dependencies, builds the web app, generates the Android wrapper using Capacitor, and runs Gradle.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

## Recommended production architecture

- Authentication + database + realtime messaging: a backend service such as Supabase, with row-level security and verified email.
- Image and audio files: private object storage with upload limits and access rules.
- Voice/video: WebRTC plus signaling and STUN/TURN infrastructure.
- Payments: a payment provider available to the merchant's country, server-side checkout and verified webhooks. Never put secret keys in this repository or in the mobile app.
- Admin panel: server-side role checks; never rely on a hidden button or client-side flag to grant admin access.

Before production, add privacy policy, terms, abuse reporting/blocking, account deletion, rate limits, backups, and security review.
