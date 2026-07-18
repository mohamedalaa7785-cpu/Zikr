import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json([
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'com.zikr.app',
        sha256_cert_fingerprints: [
          process.env.ANDROID_APP_LINKS_SHA256 ?? 'REPLACE_WITH_RELEASE_SIGNING_CERT_SHA256',
        ],
      },
    },
  ]);
}
