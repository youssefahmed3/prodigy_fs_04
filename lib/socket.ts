// lib/socket.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000'; // Replace with your backend URL

let socket: Socket;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false, // Control connection manually
      // transports: ['websocket'], // Use WebSocket transport
    });
  }
  return socket;
}