// socketClient.ts
import { io } from 'socket.io-client';

export const socket = io('http://localhost:9099', {
	// Replace with your server's URL in production
	transports: ['websocket'], // Use WebSocket as the transport method
	autoConnect: true,
});
