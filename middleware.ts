import { getToken as getNextToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	const { pathname, searchParams } = request.nextUrl;

	// Define your auth pages
	const isAuthPage =
		pathname === '/auth' ||
		pathname === '/auth/' ||
		pathname === '/auth/admin-auth';
	const isProtectedRoute = pathname === '/' || !pathname.startsWith('/auth');

	const token = await getNextToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
	});

	// 1. Not logged in and accessing protected route
	if (!token && isProtectedRoute) {
		const loginUrl = new URL('/auth', request.url);
		loginUrl.searchParams.set('tab', 'login');

		// Include full path + query in redirectTo
		const fullPath = `${request.nextUrl.pathname}${request.nextUrl.search}`;
		loginUrl.searchParams.set('redirectTo', fullPath);

		return NextResponse.redirect(loginUrl);
	}

	// 2. Logged in and visiting an auth page
	if (token && isAuthPage) {
		const redirectTo = searchParams.get('redirectTo');
		if (redirectTo) {
			return NextResponse.redirect(new URL(redirectTo, request.url));
		}
		return NextResponse.redirect(new URL('/', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
