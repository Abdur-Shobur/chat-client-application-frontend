// lib/socket.ts
import { io } from 'socket.io-client';
import { env } from './env';

const socket = io(env.baseRoute); // adjust to your API server

export default socket;
