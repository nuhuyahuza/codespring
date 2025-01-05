import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export async function middleware(request: NextRequest) {
  // Check if it's an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = await getToken({ req: request });
    if (!token || token.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Skip maintenance mode check for admin routes and API routes
  if (
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/api')
  ) {
    return NextResponse.next();
  }

  try {
    // Check maintenance mode
    const settings = await prisma.systemSettings.findFirst();
    if (settings?.maintenanceMode) {
      // Allow static assets to be served during maintenance
      if (
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/images') ||
        request.nextUrl.pathname.startsWith('/maintenance')
      ) {
        return NextResponse.next();
      }

      // Redirect to maintenance page
      return NextResponse.redirect(new URL('/maintenance', request.url));
    }
  } catch (error) {
    console.error('Error checking maintenance mode:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}; 