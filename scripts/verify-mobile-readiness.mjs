import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = [
  'capacitor.config.json',
  'android/app/src/main/AndroidManifest.xml',
  'android/app/src/main/java/com/zikr/app/MainActivity.java',
  'android/app/src/main/res/drawable/ic_stat_zikr.xml',
  'android/app/src/main/res/drawable/splash.xml',
  'ios/App/App/Info.plist',
  'ios/App/App/App.entitlements',
  'app/.well-known/assetlinks.json/route.ts',
  'app/.well-known/apple-app-site-association/route.ts',
  'components/layout/native-capacitor-bridge.tsx',
  'public/sw.js',
  'app/manifest.ts',
];

const failures = [];
const warnings = [];

for (const file of requiredFiles) {
  if (!existsSync(file)) failures.push(`Missing required mobile file: ${file}`);
}

const read = (file) => (existsSync(file) ? readFileSync(file, 'utf8') : '');
const capacitor = JSON.parse(read('capacitor.config.json'));
if (capacitor.appId !== 'com.zikr.app') failures.push('Capacitor appId must be com.zikr.app');
if (capacitor.appName !== 'ZIKR | ذِكرٌ') failures.push('Capacitor appName must be ZIKR | ذِكرٌ');
if (capacitor.server?.url !== 'https://zikrmediaofficial.vercel.app') {
  failures.push('Capacitor server.url must point at the production SSR origin');
}

const androidManifest = read('android/app/src/main/AndroidManifest.xml');
for (const token of [
  'android.permission.POST_NOTIFICATIONS',
  'android.permission.CAMERA',
  'android.permission.RECORD_AUDIO',
  'android.permission.USE_BIOMETRIC',
  'android:autoVerify="true"',
  'android:host="zikrmediaofficial.vercel.app"',
  'android:scheme="com.zikr.app"',
  'android:supportsRtl="true"',
]) {
  if (!androidManifest.includes(token)) failures.push(`Android manifest missing ${token}`);
}

const plist = read('ios/App/App/Info.plist');
for (const token of [
  '<string>com.zikr.app</string>',
  '<key>NSCameraUsageDescription</key>',
  '<key>NSMicrophoneUsageDescription</key>',
  '<key>NSFaceIDUsageDescription</key>',
  '<string>audio</string>',
  '<string>remote-notification</string>',
  '<key>WKAppBoundDomains</key>',
]) {
  if (!plist.includes(token)) failures.push(`iOS Info.plist missing ${token}`);
}

const entitlements = read('ios/App/App/App.entitlements');
if (!entitlements.includes('applinks:zikrmediaofficial.vercel.app')) {
  failures.push('iOS entitlements missing production associated domain');
}

const bridge = read('components/layout/native-capacitor-bridge.tsx');
for (const token of ['zikrNative', 'appUrlOpen', 'networkStatusChange', 'Share', 'Camera', 'Filesystem', 'Haptics']) {
  if (!bridge.includes(token)) failures.push(`Native bridge missing ${token}`);
}

if (!process.env.ANDROID_APP_LINKS_SHA256) {
  warnings.push('ANDROID_APP_LINKS_SHA256 is not set; replace the assetlinks placeholder before Play Store release.');
}
if (!process.env.IOS_ASSOCIATED_DOMAIN_APP_ID) {
  warnings.push('IOS_ASSOCIATED_DOMAIN_APP_ID is not set; replace TEAMID.com.zikr.app before App Store release.');
}

for (const warning of warnings) console.warn(`⚠️ ${warning}`);

if (failures.length) {
  for (const failure of failures) console.error(`❌ ${failure}`);
  process.exit(1);
}

console.log('✅ Mobile readiness configuration checks passed');
