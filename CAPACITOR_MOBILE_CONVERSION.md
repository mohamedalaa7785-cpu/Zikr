# ZIKR Mobile Conversion — Capacitor Implementation Guide

**Objective**: Convert Next.js web app to production-ready Android + iOS applications using Capacitor.js

**Timeline**: 6-8 weeks parallel with SEO optimization

**Scope**: Single codebase, native runtime for mobile, preserve web application

---

## PHASE 1: Capacitor Initialization (Week 1)

### Step 1.1: Install Capacitor Core
```bash
npm install @capacitor/core @capacitor/cli
npx cap init ZIKR com.zikrmedia.app
```

### Step 1.2: Create Capacitor Config (`capacitor.config.ts`)
```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.zikrmedia.app',
  appName: 'ZIKR',
  webDir: 'out', // Next.js static export
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
    hostname: 'localhost',
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#0A2A1E',
      sound: 'beep.wav',
    },
    Storage: {
      group: 'group.com.zikrmedia.app',
    },
    BiometricAuth: {
      bioAuthEnabled: true,
    },
    Geolocation: {
      enableHighAccuracy: true,
    },
  },
};

export default config;
```

### Step 1.3: Update package.json Scripts
```json
{
  "scripts": {
    "build": "next build && next export",
    "build:app": "npm run build && npx cap build android && npx cap build ios",
    "cap:sync": "npx cap sync",
    "cap:open:android": "npx cap open android",
    "cap:open:ios": "npx cap open ios"
  }
}
```

### Step 1.4: Create Next.js Export Config
Update `next.config.ts`:
```typescript
const nextConfig = {
  output: 'export', // Static export for Capacitor
  images: {
    unoptimized: true, // Required for static export
  },
  // ... rest of config
};
```

---

## PHASE 2: Android Setup (Week 2)

### Step 2.1: Generate Android Project
```bash
npm run build
npx cap add android
cd android
```

### Step 2.2: Configure Android Manifest (`android/app/src/main/AndroidManifest.xml`)

**Permissions to add**:
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.VIBRATE" />

<uses-feature android:name="android.hardware.camera" />
<uses-feature android:name="android.hardware.camera.autofocus" />
<uses-feature android:name="android.hardware.camera2" />
```

**Deep Links Setup**:
```xml
<activity android:name="com.zikrmedia.app.MainActivity">
  <intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="zikrmediaofficial.vercel.app" />
    <data android:scheme="zikr" />
  </intent-filter>
</activity>
```

### Step 2.3: Configure Firebase Cloud Messaging (FCM)

1. Create Firebase project at firebase.google.com
2. Download `google-services.json`
3. Place in `android/app/google-services.json`
4. Add FCM plugin: `npm install @capacitor-firebase/messaging`

### Step 2.4: Digital Asset Links (app.links verification)

Create `.well-known/assetlinks.json` in `public/`:
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.zikrmedia.app",
      "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
    }
  }
]
```

Generate fingerprint: `keytool -list -v -keystore android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android`

### Step 2.5: App Signing Configuration

**Create keystore for release build**:
```bash
keytool -genkey -v -keystore release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias zikr-release
```

**Update `android/app/build.gradle`**:
```gradle
android {
  signingConfigs {
    release {
      storeFile file('release.keystore')
      storePassword '...'
      keyAlias 'zikr-release'
      keyPassword '...'
    }
  }
  
  buildTypes {
    release {
      signingConfig signingConfigs.release
      debuggable false
      minifyEnabled true
      shrinkResources true
    }
  }
}
```

---

## PHASE 3: iOS Setup (Week 2-3)

### Step 3.1: Generate iOS Project
```bash
npx cap add ios
cd ios/App
pod install
open App.xcworkspace # NEVER open App.xcodeproj
```

### Step 3.2: Configure iOS Info.plist

Add required permissions:
```xml
<key>NSCameraUsageDescription</key>
<string>ZIKR needs camera access for video recording</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>ZIKR needs your location for prayer times</string>

<key>NSMicrophoneUsageDescription</key>
<string>ZIKR needs microphone access for audio recording</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>ZIKR needs photo library access to save images</string>

<key>NSFaceIDUsageDescription</key>
<string>ZIKR uses Face ID for secure authentication</string>
```

### Step 3.3: Configure Universal Links (Apple Associated Domains)

1. Register domain at Apple Developer: `zikrmediaofficial.vercel.app`
2. Create `.well-known/apple-app-site-association` in `public/`:
```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.zikrmedia.app",
        "paths": ["*"]
      }
    ]
  },
  "webcredentials": {
    "apps": ["TEAM_ID.com.zikrmedia.app"]
  }
}
```

### Step 3.4: Xcode Project Configuration

**In Xcode**:
1. Select `App` target
2. General → Team: select your Apple Developer team
3. Signing & Capabilities → add:
   - Sign in with Apple
   - Associated Domains: `applinks:zikrmediaofficial.vercel.app`
   - Push Notifications
   - Background Modes (audio, location)

### Step 3.5: App Store Code Signing

1. Create distribution provisioning profile in Apple Developer
2. Add code signing certificate to keychain
3. Select provisioning profile in Xcode

---

## PHASE 4: Native Features (Week 3-4)

### Step 4.1: Push Notifications

**Install plugin**:
```bash
npm install @capacitor-firebase/messaging
```

**Implementation** (`lib/mobile/push-notifications.ts`):
```typescript
import { MessagingPlugin } from '@capacitor-firebase/messaging';

export async function initPushNotifications() {
  await requestPermissions();
  
  const token = await MessagingPlugin.getToken();
  console.log('FCM Token:', token.token);
  
  // Send to Supabase for user mapping
  await savePushToken(token.token);
}

async function savePushToken(token: string) {
  const supabase = await createClient();
  await supabase
    .from('profiles')
    .update({ push_token: token })
    .eq('id', userId);
}
```

### Step 4.2: Biometric Authentication

**Install plugin**:
```bash
npm install @capacitor-community/biometric-auth
```

**Implementation**:
```typescript
import { BiometricAuth } from '@capacitor-community/biometric-auth';

export async function authenticateWithBiometric() {
  try {
    const result = await BiometricAuth.authenticate({
      reason: 'Verify your identity',
      title: 'ZIKR Authentication',
      subtitle: 'Use your fingerprint or face to login',
    });
    
    if (result.success) {
      // Unlock app or perform action
    }
  } catch (error) {
    console.error('Biometric auth failed:', error);
  }
}
```

### Step 4.3: Camera Access

**Install plugin**:
```bash
npm install @capacitor/camera
```

### Step 4.4: File System Access

**Install plugin**:
```bash
npm install @capacitor/filesystem
```

### Step 4.5: Network Status

**Install plugin**:
```bash
npm install @capacitor/network
```

**Implementation** (`lib/mobile/offline-sync.ts`):
```typescript
import { Network } from '@capacitor/network';

export async function watchNetworkStatus() {
  const removeListener = await Network.addListener('networkStatusChange', status => {
    if (status.connected) {
      syncPendingData();
    }
  });
}
```

### Step 4.6: Local Notifications (Prayer Times)

**Install plugin**:
```bash
npm install @capacitor/local-notifications
```

**Implementation**:
```typescript
import { LocalNotifications } from '@capacitor/local-notifications';

export async function schedulePrayerNotifications() {
  const prayerTimes = getPrayerTimesForDay();
  
  await LocalNotifications.schedule({
    notifications: prayerTimes.map(prayer => ({
      title: `${prayer.name} Prayer Time`,
      body: `Prayer time in 5 minutes`,
      id: prayer.id,
      at: new Date(prayer.time.getTime() - 5 * 60 * 1000),
      sound: 'notification.mp3',
      extra: { prayerId: prayer.id },
    })),
  });
}
```

---

## PHASE 5: Authentication & OAuth (Week 4)

### Step 5.1: Google OAuth for Mobile

**Android Setup**:
1. Create OAuth 2.0 credential in Google Cloud Console
2. Set authorized redirect URI: `com.zikrmedia.app://oauth2callback`
3. Download client ID

**iOS Setup**:
1. Create OAuth 2.0 credential with URL scheme: `com.zikrmedia.app`
2. Download client ID

**Implementation**:
```typescript
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

export async function signInWithGoogle() {
  try {
    const result = await GoogleAuth.signIn();
    
    const { user, authentication } = result;
    const { idToken } = authentication;
    
    // Authenticate with Supabase using ID token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
    
    if (error) throw error;
    
    return data.user;
  } catch (error) {
    console.error('Google sign-in failed:', error);
  }
}
```

### Step 5.2: Secure Token Storage

**Use native secure storage**:
```typescript
import { Storage } from '@capacitor/storage';

export async function saveAuthToken(token: string) {
  await Storage.set({
    key: 'auth_token',
    value: token,
  });
}

export async function getAuthToken(): Promise<string | null> {
  const result = await Storage.get({ key: 'auth_token' });
  return result.value;
}
```

---

## PHASE 6: App Branding & Configuration (Week 4-5)

### Step 6.1: App Icon

Generate icons:
```bash
npm install --save-dev @capacitor/assets

npx cap-assets generate --assetPath assets/icon.png
```

Files auto-generated:
- `android/app/src/main/res/mipmap-*/ic_launcher.png`
- `ios/App/App/Assets.xcassets/AppIcon.appiconset/`

### Step 6.2: Splash Screen

**Install plugin**:
```bash
npm install @capacitor/splash-screen
```

**Generate splash**:
```bash
npx cap-assets generate --assetPath assets/splash.png --splashOnly
```

**Implementation** (`app/layout.tsx`):
```typescript
import { SplashScreen } from '@capacitor/splash-screen';

useEffect(() => {
  async function hideSplash() {
    await SplashScreen.hide();
  }
  hideSplash();
}, []);
```

### Step 6.3: Status Bar Customization

```typescript
import { StatusBar, Style } from '@capacitor/status-bar';

export async function configureStatusBar() {
  await StatusBar.setStyle({ style: Style.Dark });
  await StatusBar.setBackgroundColor({ color: '#0A2A1E' });
  await StatusBar.setOverlaysWebView({ overlay: true });
}
```

---

## PHASE 7: Build & Release (Week 5-6)

### Step 7.1: Android Release Build

```bash
cd android
./gradlew bundle -x assembleRelease
```

**Output**: `android/app/build/outputs/bundle/release/app-release.aab`

### Step 7.2: iOS Release Build

```bash
cd ios/App
xcodebuild archive \
  -scheme App \
  -archivePath App.xcarchive \
  -configuration Release
```

### Step 7.3: Play Store Submission

1. Create Google Play Developer account ($25)
2. Upload app signed bundle
3. Configure store listing, graphics, permissions
4. Submit for review (typically 2-4 hours)

### Step 7.4: App Store Submission

1. Create Apple Developer account ($99/year)
2. Archive app in Xcode
3. Upload with Transporter
4. Configure app information
5. Submit for review (typically 24-48 hours)

---

## PHASE 8: Testing & QA (Week 6-7)

### Test Matrix

| Feature | Android | iOS | Web |
|---------|---------|-----|-----|
| Auth | ✓ | ✓ | ✓ |
| Deep Linking | ✓ | ✓ | - |
| Push Notifications | ✓ | ✓ | - |
| Biometric | ✓ | ✓ | - |
| Offline Mode | ✓ | ✓ | ✓ |
| Prayer Notifications | ✓ | ✓ | - |
| Audio Playback | ✓ | ✓ | ✓ |
| Camera | ✓ | ✓ | - |
| Performance | ✓ | ✓ | ✓ |

### Performance Targets
- App startup time: < 3 seconds
- LCP: < 2.5s
- Auth flow: < 2 seconds
- Content loading: < 1 second

---

## File Structure

```
project/
├── capacitor.config.ts
├── package.json
├── app/ (Next.js app)
├── public/ (assets, assetlinks.json)
├── android/ (Android native project)
│   ├── app/
│   │   ├── build.gradle
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       └── res/
│   └── google-services.json
└── ios/ (iOS native project)
    └── App/
        ├── App.xcworkspace
        ├── Podfile
        └── App/
            ├── Info.plist
            └── Assets.xcassets/
```

---

## Success Criteria

- [ ] Build passes on both Android and iOS
- [ ] All permissions properly declared
- [ ] Deep links working correctly
- [ ] Push notifications delivering
- [ ] Biometric auth functional
- [ ] Offline mode working
- [ ] Lighthouse mobile score 90+
- [ ] App startup < 3 seconds
- [ ] Play Store listing live
- [ ] App Store listing live

---

**Next Steps**: Begin Phase 1 Capacitor initialization
