import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json({
    applinks: {
      apps: [],
      details: [
        {
          appIDs: [process.env.IOS_ASSOCIATED_DOMAIN_APP_ID ?? 'TEAMID.com.zikr.app'],
          components: [
            { '/': '/quran/*' },
            { '/': '/hadith/*' },
            { '/': '/articles/*' },
            { '/': '/dua/*' },
            { '/': '/stories/*' },
            { '/': '/auth/callback*' },
            { '/': '/*' },
          ],
        },
      ],
    },
    webcredentials: {
      apps: [process.env.IOS_ASSOCIATED_DOMAIN_APP_ID ?? 'TEAMID.com.zikr.app'],
    },
  });
}
