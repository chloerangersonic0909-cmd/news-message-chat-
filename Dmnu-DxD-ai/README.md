# Dmnu DxD AI

Android Kotlin/Compose starter with a dark cyan-purple chat interface, new-chat button, pin toggle, image picker, configurable backend URL, and GitHub Actions APK build.

## Build
Open the repository Actions tab and run **Build Dmnu DxD AI APK**. When it succeeds, download the **Dmnu-DxD-ai-debug-apk** artifact and extract `app-debug.apk`.

## Backend contract
POST JSON `{"message":"..." }` to the configured endpoint. Return JSON `{"reply":"..." }`.

## Current limits
The selected image is not uploaded to or analyzed by the backend yet. Pinning is a UI toggle, not persistent multi-chat history. Device-control actions are not implemented. This workflow builds a debug APK, not a Play Store release-signed APK.
