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
import { io, Socket } from 'socket.io-client';
import { getSession } from 'next-auth/react';
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
		console.log('🔁 Reusing existing socket connection');
		return socket;
	}

	if (!socket) {
		socket = io(env.baseRoute, {
			auth: {
				token: session.accessToken,
			},
			autoConnect: false, // Important!
			transports: ['websocket'],
		});
	}

	return new Promise((resolve, reject) => {
		socket!.auth = { token: session.accessToken }; // Re-assign token in case it changed

		socket!.connect(); // manually connect

		socket!.on('connect', () => {
			console.log('✅ Connected to socket.io server');
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
