export const env = {
	production: process.env.NODE_ENV === 'production',
	development: process.env.NODE_ENV === 'development',
	baseAPI: ((process.env.NEXT_PUBLIC_BACKEND_API as string) +
		process.env.NEXT_PUBLIC_API_VERSION) as string,
	baseRoute: process.env.NEXT_PUBLIC_BACKEND_API as string,
	next_auth_url: process.env.NEXT_PUBLIC_AUTH_URL as string,
};
