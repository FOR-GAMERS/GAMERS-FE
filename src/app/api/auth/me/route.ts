import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import https from 'https';

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const API_URL = RAW_API_URL.endsWith('/api') 
  ? RAW_API_URL 
  : `${RAW_API_URL.replace(/\/$/, '')}/api`;

const sslAgent = new https.Agent({
  rejectUnauthorized: false,
});

export async function GET() {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get('access_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;
  let wasRefreshed = false;

  // Helper to decode JWT payload safely
  const decodeJwt = (token: string) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      return JSON.parse(Buffer.from(parts[1], 'base64').toString());
    } catch (e) {
      return null;
    }
  };

  // 1. Initial Check & Expire Verification
  let payload = accessToken ? decodeJwt(accessToken) : null;
  const now = Math.floor(Date.now() / 1000);
  
  // If token is missing OR explicitly expired
  const isExpired = payload?.exp ? payload.exp < now : false;

  if (!accessToken || !payload || isExpired) {
      console.log('[Proxy] Token missing, invalid, or expired. Checking refresh token...');
      
      if (!refreshToken) {
         return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
      }

      try {
          // 2. Attempt Refresh
          const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ refresh_token: refreshToken }),
              // @ts-expect-error - agent is not in standard RequestInit but supported by node-fetch/undici in Next.js
              agent: sslAgent,
          });

          if (!refreshRes.ok) {
              console.log('[Proxy] Refresh failed with status:', refreshRes.status);
              return NextResponse.json({ message: 'Session expired' }, { status: 401 });
          }

          const refreshData = await refreshRes.json();
          // Check typical response structure
          const newAccessToken = refreshData.data?.access_token || refreshData.access_token;
          
          if (newAccessToken) {
              console.log('[Proxy] Token refreshed successfully');
              accessToken = newAccessToken;
              payload = decodeJwt(newAccessToken);
              wasRefreshed = true;
          } else {
              console.error('[Proxy] No access token in refresh response', refreshData);
              return NextResponse.json({ message: 'Invalid refresh response' }, { status: 401 });
          }

      } catch (error) {
          console.error('[Proxy] Refresh verification error:', error);
          return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
      }
  }

  // 3. Return Authentication Status (Minimal from JWT)
  // We do NOT call backend /users/my here to save latency/prevent circular or redundant calls
  if (!payload || !payload.user_id) {
       return NextResponse.json({ message: 'Invalid token payload' }, { status: 401 });
  }

  const userData = {
      user_id: payload.user_id,
      username: payload.sub || "User",
      // Add other claims if relevant
  };

  const response = NextResponse.json({
      data: userData,
      status: 200,
      message: "Authenticated"
  });

  // 4. Update Cookies if Refreshed
  if (wasRefreshed && accessToken) {
      response.cookies.set('access_token', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 * 60 * 24 
      });
  }

  return response;
}
