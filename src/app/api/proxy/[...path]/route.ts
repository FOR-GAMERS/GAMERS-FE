import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import https from 'https';

const RAW_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const API_URL = RAW_API_URL.endsWith('/api') 
  ? RAW_API_URL 
  : `${RAW_API_URL.replace(/\/$/, '')}/api`;

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
      body: request.body, // Pass the body stream directly
      // @ts-expect-error - duplex is required for streaming bodies in Next.js/Node fetch
      duplex: 'half',
      // agent is supported in Node.js environment
      agent: sslAgent, 
    });

    // Handle response
    const responseHeaders = new Headers(response.headers);
    
    // Forward the response
    return new NextResponse(response.body, {
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
