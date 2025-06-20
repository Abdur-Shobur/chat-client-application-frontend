import 'next-auth/jwt';
import { DefaultJWT } from 'next-auth/jwt';
type UserType = {
	email: string;
	name: string;
	phone: string;
	status: string;
	id: string;
	role: 'admin' | 'user';
};
declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	// eslint-disable-next-line no-unused-vars
	interface Session {
		user: UserType;
		accessToken: string;
		refreshToken: string;
	}

	// eslint-disable-next-line no-unused-vars
	interface JWT extends DefaultJWT {
		user?: UserType;
		accessToken?: string;
		refreshToken?: string;
	}
}

declare module 'next-auth/jwt' {
	// eslint-disable-next-line no-unused-vars
	interface JWT extends DefaultJWT {
		user?: UserType;
		accessToken?: string;
		refreshToken?: string;
	}
}
