import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Align default with proxy route to handle NEXT_PUBLIC_API_URL consistently
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 });
  }

  try {
    // Construct URL preventing double /api if API_URL already ends with it
    const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
    // If baseUrl ends with '/api', we append '/auth/refresh'. 
    // If it doesn't (root host), we might need '/api/auth/refresh'.
    // Given the Proxy logic assumes API_URL includes '/api', we treat API_URL as the base for API endpoints.
    // So we append '/auth/refresh' (stripping leading 'api/' if intended, but let's be safe).
    
    // Logic: If API_URL ends in '/api', use it directly with '/auth/refresh'.
    // If API_URL is just host, add '/api/auth/refresh'.
    // However, simplest is to follow Proxy's pattern: API_URL IS the prefix.
    const targetPath = '/auth/refresh'; 
    const targetUrl = `${baseUrl}${targetPath}`;
    
    console.log(`[Refresh] Attempting refresh at ${targetUrl}`);

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
        console.error(`[Refresh] Failed with status ${response.status}`);
        const errorRes = NextResponse.json({ message: 'Refresh failed' }, { status: 401 });
        errorRes.cookies.delete('access_token');
        errorRes.cookies.delete('refresh_token');
        return errorRes;
    }

    const data = await response.json();
    
    // Robustly handle response structure (wrapped in data or direct)
    const newAccessToken = data.data?.access_token || data.access_token;
    const newRefreshToken = data.data?.refresh_token || data.refresh_token || refreshToken;

    if (!newAccessToken) {
        console.error('[Refresh] Invalid response structure:', data);
        return NextResponse.json({ message: 'Invalid refresh response' }, { status: 401 });
    }

    const successRes = NextResponse.json({ 
        message: 'Refreshed',
        // Optional: return tokens in body if client needs them immediately, though cookies are preferred
    }, { status: 200 });

    // Set new cookies
    successRes.cookies.set('access_token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 day
    });

    if (newRefreshToken) {
        successRes.cookies.set('refresh_token', newRefreshToken, {
             httpOnly: true,
             secure: process.env.NODE_ENV === 'production',
             path: '/',
             maxAge: 60 * 60 * 24 * 7 // 7 days
        });
    }

    return successRes;

  } catch (error) {
    console.error('[Refresh Proxy Error]', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
