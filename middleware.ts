import { getToken as getNextToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	const { pathname, searchParams } = request.nextUrl;

	const isAuthPage = pathname === '/auth';

	const isProtectedRoute =
		pathname === '/' ||
		pathname.startsWith('/admin') ||
		pathname.startsWith('/user');

	const token = await getNextToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	const role = token?.user?.role || null;

	// 1. Not logged in and accessing protected route
	if (!token && isProtectedRoute) {
		const loginUrl = new URL('/auth', request.url);
		loginUrl.searchParams.set('tab', 'login');

		// ✅ Include full path + query in redirectTo
		const fullPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
		loginUrl.searchParams.set('redirectTo', fullPath);

		return NextResponse.redirect(loginUrl);
	}

	// 2. Logged in and visiting /auth
	if (token && isAuthPage) {
		const redirectTo = searchParams.get('redirectTo');
		if (redirectTo) {
			return NextResponse.redirect(new URL(redirectTo, request.url));
		}
		const dashboard = role === 'admin' ? '/admin' : '/user';
		return NextResponse.redirect(new URL(dashboard, request.url));
	}

	// 3. Role mismatch
	if (role === 'user' && pathname.startsWith('/admin')) {
		return NextResponse.redirect(new URL('/user', request.url));
	}
	if (role === 'admin' && pathname.startsWith('/user')) {
		return NextResponse.redirect(new URL('/admin', request.url));
	}

	// 4. All good
	return NextResponse.next();
}

export const config = {
	matcher: ['/', '/admin/:path*', '/user/:path*', '/auth'],
};
