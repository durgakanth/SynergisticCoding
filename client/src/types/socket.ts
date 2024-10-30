import { Socket } from "socket.io-client";

type SocketId = string;

// Enum for Socket Events
enum SocketEvent {
    JOIN_REQUEST = "join-request",
    JOIN_ACCEPTED = "join-accepted",
    USER_JOINED = "user-joined",
    USER_DISCONNECTED = "user-disconnected",
    SYNC_FILE_STRUCTURE = "sync-file-structure",
    DIRECTORY_CREATED = "directory-created",
    DIRECTORY_UPDATED = "directory-updated",
    DIRECTORY_RENAMED = "directory-renamed",
    DIRECTORY_DELETED = "directory-deleted",
    FILE_CREATED = "file-created",
    FILE_UPDATED = "file-updated",
    FILE_RENAMED = "file-renamed",
    FILE_DELETED = "file-deleted",
    USER_OFFLINE = "offline",
    USER_ONLINE = "online",
    SEND_MESSAGE = "send-message",
    RECEIVE_MESSAGE = "receive-message",
    TYPING_START = "typing-start",
    TYPING_PAUSE = "typing-pause",
    USERNAME_EXISTS = "username-exists",
    REQUEST_DRAWING = "request-drawing",
    SYNC_DRAWING = "sync-drawing",
    DRAWING_UPDATE = "drawing-update",
    ANSWER = 'answer', // For WebRTC answer
    ICE_CANDIDATE = 'ice-candidate', // For ICE candidates
    OFFER = "offer", // For WebRTC offer
}

// Interface for Socket Context
interface SocketContext {
    socket: Socket;
}

// Interface for Socket Context Type
interface SocketContextType extends SocketContext {
    localStream: MediaStream | null; // Nullable MediaStream for local video/audio
    remoteStreams: { [socketId: string]: MediaStream }; // Mapping of remote streams by socket ID
}

// Exporting the types and enum
export { SocketEvent, SocketContext, SocketContextType, SocketId };
