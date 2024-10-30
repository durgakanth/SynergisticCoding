// src/socket.ts
import { io } from "socket.io-client";

// Connect to the Socket.IO server
const socket = io("http://localhost:3000"); // Use your server URL

// When connected, you can access the socket ID
socket.on("connect", () => {
    console.log("My Socket ID:", socket.id); // This will log your socket ID
});

// Export the socket instance for use in other modules
export default socket;
