import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import https from 'https';

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
// Ensure protocol is present. If missing, assume https unless localhost
const withProtocol = RAW_API_URL.match(/^https?:\/\//) 
  ? RAW_API_URL 
  : RAW_API_URL.includes('localhost') 
    ? `http://${RAW_API_URL}` 
    : `https://${RAW_API_URL}`;

const API_URL = withProtocol.endsWith('/api') 
  ? withProtocol 
  : `${withProtocol.replace(/\/$/, '')}/api`;

const sslAgent = new https.Agent({
  rejectUnauthorized: false,
});

async function handleProxy(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  const pathString = path.join('/');
  const searchParams = request.nextUrl.search;
  const targetUrl = `${API_URL}/${pathString}${searchParams}`;

  // Get tokens from HttpOnly cookies
  const cookieStore = await cookies();
  // Debug Log
  console.log('[Proxy] Incoming Cookies:', cookieStore.getAll().map(c => `${c.name}=${c.value.substring(0, 10)}...`));
  
  const accessToken = cookieStore.get('access_token')?.value;

  // Prepare headers
  const headers = new Headers(request.headers);
  
  // Clean up headers that might confuse the backend or are host-specific
  headers.delete('host');
  headers.delete('connection');
  headers.delete('cookie'); // backend doesn't need our cookies

  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
      body: request.body,
      // @ts-expect-error - duplex is required for streaming bodies
      duplex: 'half',
      agent: sslAgent, 
    });

    console.log(`[Proxy] Upstream Status: ${response.status}`);

    // Handle response
    const responseHeaders = new Headers(response.headers);
    
    // Remove headers that cause issues when forwarding
    responseHeaders.delete('content-encoding');
    responseHeaders.delete('content-length');
    responseHeaders.delete('transfer-encoding');

    // Buffer the body to avoid streaming issues
    const bodyBuffer = await response.arrayBuffer();
    
    // Forward the response
    return new NextResponse(bodyBuffer, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error: any) {
    console.error('[Proxy Error]', error);
    return NextResponse.json(
      { 
        message: 'Proxy request failed', 
        error: error.message,
        cause: error.cause,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
      }, 
      { status: 500 }
    );
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const PATCH = handleProxy;
export const DELETE = handleProxy;
