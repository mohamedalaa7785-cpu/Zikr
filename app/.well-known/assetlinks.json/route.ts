import { NextResponse } from 'next/server';

/**
 * Digital Asset Links file for Android App Links verification.
 * Must be served at /.well-known/assetlinks.json
 *
 * Replace SHA256_CERT_FINGERPRINT with your release keystore's SHA-256 fingerprint.
 * Obtain it with:
 *   keytool -list -v -keystore release.keystore -alias zikr
 * or from Play Console → Setup → App integrity → App signing key certificate.
 *
 * The package_name must match applicationId in android/app/build.gradle.
 */
export async function GET() {
  const assetlinks = [
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'com.zikr.app',
        sha256_cert_fingerprints: [
          'SHA256_CERT_FINGERPRINT',
        ],
      },
    },
  ];

  return new NextResponse(JSON.stringify(assetlinks, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
