import { NextResponse } from 'next/server';

/**
 * Apple App Site Association (AASA) file.
 * Required for Universal Links on iOS.
 * Must be served at /.well-known/apple-app-site-association
 * with Content-Type: application/json (no .json extension).
 *
 * Replace TEAMID with your 10-character Apple Team ID from
 * https://developer.apple.com/account/#/membership
 * The bundle ID must match the CFBundleIdentifier in your Xcode project.
 */
export async function GET() {
  const aasa = {
    applinks: {
      apps: [],
      details: [
        {
          appIDs: ['TEAMID.com.zikr.app'],
          components: [
            { '/': '/auth/callback*', comment: 'OAuth callback deep link' },
            { '/': '/quran/*', comment: 'Quran deep links' },
            { '/': '/hadith/*', comment: 'Hadith deep links' },
            { '/': '/stories/*', comment: 'Stories deep links' },
            { '/': '/prayer-times', comment: 'Prayer times deep link' },
            { '/': '/profile', comment: 'Profile deep link' },
          ],
        },
      ],
    },
    webcredentials: {
      apps: ['TEAMID.com.zikr.app'],
    },
  };

  return new NextResponse(JSON.stringify(aasa, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
