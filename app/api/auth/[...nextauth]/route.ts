import { UserType } from '@/types';
import NextAuth, { User as NextAuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Define the extended user type
interface CustomUser extends NextAuthUser {
	accessToken?: string;
	refreshToken?: string;
	user: UserType;
}

const handler = NextAuth({
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				token: {},
			},
			async authorize(credentials) {
				if (credentials?.token) {
					const parsedToken = JSON.parse(credentials.token);

					return {
						id: parsedToken.data.user.email,
						accessToken: parsedToken.data.accessToken,
						refreshToken: '', // Set this if you have a refresh token
						user: parsedToken.data.user,
					};
				}
				return null;
			},
		}),
	],
	session: {
		strategy: 'jwt',
	},
	callbacks: {
		async jwt({ token, user }) {
			// On initial login, `user` is available
			if (user) {
				const customUser = user as CustomUser;
				return {
					...token,
					accessToken: customUser.accessToken,
					refreshToken: customUser.refreshToken,
					user: customUser.user,
				};
			}

			return token;
		},

		async session({ session, token }) {
			// Map token properties to session
			session.accessToken = token.accessToken as string;
			session.refreshToken = token.refreshToken as string;
			session.user = token.user as UserType;

			return session;
		},
	},
});

export { handler as GET, handler as POST };
