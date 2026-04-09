// lib/socket.ts
import { io } from "socket.io-client";

// Define your production backend URL
const SOCKET_URL = "https://idexam.duckdns.org";

// Initialize the socket but do NOT auto-connect yet.
// We only want it to connect when a user actually enters an exam room.
export const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: false, 
});