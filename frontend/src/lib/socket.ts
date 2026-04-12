import { io } from "socket.io-client";

// Vite uses import.meta.env instead of process.env
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  // Socket.io automatically appends "/socket.io/" to the URL you provide, 
  // which perfectly matches the Nginx location block we just created.
  path: "/socket.io/", 
  transports: ["websocket", "polling"],
});