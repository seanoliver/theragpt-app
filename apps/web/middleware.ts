import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)
  
  // Add request context headers for LLM tracing
  requestHeaders.set('x-request-path', request.nextUrl.pathname)
  
  // Extract session ID from cookies if available
  const sessionId = request.cookies.get('session-id')?.value
  if (sessionId) {
    requestHeaders.set('x-session-id', sessionId)
  }
  
  // Continue with the request
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Match API routes
    '/api/:path*',
  ],
}