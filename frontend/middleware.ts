import { getToken as getNextToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Public auth route
	const isAuthPage = pathname === '/auth';

	// Protected routes: home, admin, and user
	const isProtectedRoute =
		pathname === '/' ||
		pathname.startsWith('/admin') ||
		pathname.startsWith('/user');

	// Get token from cookies (JWT from next-auth)
	const token = await getNextToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	const role = token?.user?.role || null;

	// 1. If no token and trying to access protected route, redirect to login
	if (!token && isProtectedRoute) {
		return NextResponse.redirect(new URL('/auth?tab=login', request.url));
	}

	// 2. Authenticated but going to /auth — redirect to respective dashboard
	if (token && isAuthPage) {
		const redirectTo = role === 'admin' ? '/admin' : '/user';
		return NextResponse.redirect(new URL(redirectTo, request.url));
	}

	// 3. Role mismatch: user trying to access admin route or vice versa
	if (role === 'user' && pathname.startsWith('/admin')) {
		return NextResponse.redirect(new URL('/user', request.url));
	}

	if (role === 'admin' && pathname.startsWith('/user')) {
		return NextResponse.redirect(new URL('/admin', request.url));
	}

	// 4. Otherwise allow
	return NextResponse.next();
}

// Match only relevant routes including home page
export const config = {
	matcher: ['/', '/admin/:path*', '/user/:path*', '/auth'],
};
