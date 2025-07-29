// socketClient.ts
// import { io } from 'socket.io-client';
// export const socket = io(env.baseRoute, {
//  	transports: ['websocket'],
// 	autoConnect: true,
// 	auth: async () => {
// 		const session = await getSession();
// 		if (!session?.accessToken) {
// 			console.warn('No access token in session');
// 			return {};
// 		}
// 		return { token: session.accessToken };
// 	},
// });
import { getSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';
import { env } from './env';

let socket: Socket | null = null;

export const connectSocket = async (): Promise<Socket | null> => {
	const session = await getSession();

	if (!session?.accessToken) {
		console.warn('No access token in session');
		return null;
	}

	// ❗ Prevent duplicate socket connections
	if (socket && socket.connected) {
		return socket;
	}

	if (!socket) {
		if (env.production) {
			socket = io(env.next_auth_url, {
				path: '/backend/socket.io',
				auth: {
					token: session.accessToken,
				},
				autoConnect: false, // Important!
				transports: ['websocket'],
			});
		} else {
			socket = io(env.baseRoute, {
				path: '/socket.io',
				auth: {
					token: session.accessToken,
				},
				autoConnect: false, // Important!
				transports: ['websocket'],
			});
		}
	}

	// if (!socket) {
	// 	socket = io(`https://zoom.com.im`, {
	// 		path: '/backend/socket.io',
	// 		auth: {
	// 			token: session.accessToken,
	// 		},
	// 		autoConnect: false,
	// 		transports: ['websocket'],
	// 	});
	// }

	return new Promise((resolve, reject) => {
		socket!.auth = { token: session.accessToken }; // Re-assign token in case it changed

		socket!.connect(); // manually connect

		socket!.on('connect', () => {
			resolve(socket!);
		});

		socket!.on('connect_error', (err) => {
			console.error('❌ Socket connection error:', err.message);
			reject(err);
		});
	});
};

export const getSocket = (): Socket | null => {
	return socket;
};
