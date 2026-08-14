import { NextRequest, NextResponse } from 'next/server';

const ALADHAN_API_BASE = 'https://api.aladhan.com/v1';

export const dynamic = 'force-dynamic'; // This route uses query parameters and must be dynamic
export const revalidate = 3600; // Cache for 1 hour

/**
 * GET /api/prayer-times
 * 
 * Proxy prayer times requests to Aladhan API to avoid CORS and crawl issues.
 * 
 * Query parameters:
 * - method: Calculation method (default: 4 = Umm Al-Qura)
 * - latitude: Latitude (for /timings endpoint)
 * - longitude: Longitude (for /timings endpoint)
 * - date: Optional date in YYYY-MM-DD format
 * - city: City name (for /timingsByCity endpoint)
 * - country: Country name (optional, for /timingsByCity endpoint)
 * - address: Address string (for /timingsByAddress endpoint)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const latitude = searchParams.get('latitude');
    const longitude = searchParams.get('longitude');
    const city = searchParams.get('city');
    const country = searchParams.get('country');
    const address = searchParams.get('address');
    const date = searchParams.get('date');
    const method = searchParams.get('method') || '4';
    
    let url = `${ALADHAN_API_BASE}/timings`;
    const params = new URLSearchParams();
    
    // Determine which endpoint to call
    if (city) {
      // Aladhan requires both city and country for timingsByCity.
      url = `${ALADHAN_API_BASE}/timingsByCity`;
      params.append('city', city);
      params.append('country', country || 'Egypt');
    } else if (address) {
      // Use timingsByAddress for free-form address
      url = `${ALADHAN_API_BASE}/timingsByAddress`;
      params.append('address', address);
    } else if (latitude && longitude) {
      // Use timings for coordinates
      url = `${ALADHAN_API_BASE}/timings`;
      params.append('latitude', latitude);
      params.append('longitude', longitude);
    } else {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Add common parameters
    params.append('method', method);
    if (date) params.append('date', date);
    
    const fullUrl = `${url}?${params.toString()}`;
    
    const response = await fetch(fullUrl, {
      headers: {
        'User-Agent': 'Zikr-App/1.0 (Prayer Times)',
      },
    });
    
    if (!response.ok) {
      console.error(`[prayer-times-api] Aladhan API error: ${response.status}`);
      return NextResponse.json(
        { error: 'Failed to fetch prayer times' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    // Return with cache headers
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'CDN-Cache-Control': 'max-age=3600',
      },
    });
  } catch (error) {
    console.error('[prayer-times-api] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
