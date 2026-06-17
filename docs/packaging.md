# Packaging IMusic

IMusic is currently packaged as an installable PWA. This produces one build that can be installed from Chromium-based browsers on Windows, macOS, Android, and from Safari's “Add to Home Screen” flow on iOS.

## Build web/PWA bundle

```bash
npm run build:pwa
```

The output is written to `dist/` and includes:

- `manifest.webmanifest` for install metadata.
- `sw.js` for app-shell caching and offline fallback.
- responsive UI that works on desktop and mobile screens.

## Platform notes

- **Windows / macOS**: run `npm run preview`, open the app in Chrome/Edge, then use the browser install button to install IMusic as a desktop app.
- **Android**: deploy the `dist/` folder to HTTPS hosting, open it in Chrome, then choose “Install app”.
- **iOS**: deploy the `dist/` folder to HTTPS hosting, open it in Safari, then choose “Add to Home Screen”.

Native `.exe`, `.dmg`, `.ipa`, and `.apk` packaging is intentionally skipped in this repository because it requires platform-specific toolchains/certificates (Electron/Tauri signing for desktop, Xcode provisioning for iOS, Android SDK signing for APK/AAB). The PWA package keeps the project buildable in the current environment while supporting installation on the requested platforms through browser-native install flows.
