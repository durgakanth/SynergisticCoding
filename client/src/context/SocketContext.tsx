import { DrawingData } from "@/types/app"
import {
    SocketEvent,
    SocketContext as SocketContextType,
    SocketId,
} from "@/types/socket"
import { RemoteUser, USER_STATUS, User } from "@/types/user"
import {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
} from "react"
import { toast } from "react-hot-toast"
import { Socket, io } from "socket.io-client"
import { useAppContext } from "./AppContext"

const SocketContext = createContext<SocketContextType | null>(null)

export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider")
    }
    return context
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const SocketProvider = ({ children }: { children: ReactNode }) => {
    const {
        users,
        setUsers,
        setStatus,
        setCurrentUser,
        drawingData,
        setDrawingData,
    } = useAppContext()
    const socket: Socket = useMemo(
        () =>
            io(BACKEND_URL, {
                reconnectionAttempts: 2,
            }),
        [],
    )

    const handleError = useCallback(
        (err: any) => {
            console.log("socket error", err)
            setStatus(USER_STATUS.CONNECTION_FAILED)
            toast.dismiss()
            toast.error("Failed to connect to the server")
        },
        [setStatus],
    )

    const handleUsernameExist = useCallback(() => {
        toast.dismiss()
        setStatus(USER_STATUS.INITIAL)
        toast.error(
            "The username you chose already exists in the room. Please choose a different username.",
        )
    }, [setStatus])

    const handleJoiningAccept = useCallback(
        ({ user, users }: { user: User; users: RemoteUser[] }) => {
            setCurrentUser(user)
            setUsers(users)
            toast.dismiss()
            setStatus(USER_STATUS.JOINED)

            if (users.length > 1) {
                toast.loading("Syncing data, please wait...")
            }
        },
        [setCurrentUser, setStatus, setUsers],
    )

    const handleUserLeft = useCallback(
        ({ user }: { user: User }) => {
            toast.success(`${user.username} left the room`)
            setUsers(users.filter((u: User) => u.username !== user.username))
        },
        [setUsers, users],
    )

    const handleRequestDrawing = useCallback(
        ({ socketId }: { socketId: SocketId }) => {
            socket.emit(SocketEvent.SYNC_DRAWING, { socketId, drawingData })
        },
        [drawingData, socket],
    )

    const handleDrawingSync = useCallback(
        ({ drawingData }: { drawingData: DrawingData }) => {
            setDrawingData(drawingData)
        },
        [setDrawingData],
    )

    useEffect(() => {
        socket.on("connect_error", handleError)
        socket.on("connect_failed", handleError)
        socket.on(SocketEvent.USERNAME_EXISTS, handleUsernameExist)
        socket.on(SocketEvent.JOIN_ACCEPTED, handleJoiningAccept)
        socket.on(SocketEvent.USER_DISCONNECTED, handleUserLeft)
        socket.on(SocketEvent.REQUEST_DRAWING, handleRequestDrawing)
        socket.on(SocketEvent.SYNC_DRAWING, handleDrawingSync)

        return () => {
            socket.off("connect_error")
            socket.off("connect_failed")
            socket.off(SocketEvent.USERNAME_EXISTS)
            socket.off(SocketEvent.JOIN_ACCEPTED)
            socket.off(SocketEvent.USER_DISCONNECTED)
            socket.off(SocketEvent.REQUEST_DRAWING)
            socket.off(SocketEvent.SYNC_DRAWING)
        }
    }, [
        handleDrawingSync,
        handleError,
        handleJoiningAccept,
        handleRequestDrawing,
        handleUserLeft,
        handleUsernameExist,
        setUsers,
        socket,
    ])

    return (
        <SocketContext.Provider
            value={{
                socket,
            }}
        >
            {children}
        </SocketContext.Provider>
    )
}

export { SocketProvider }
export default SocketContext




// import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
// import { toast } from "react-hot-toast";
// import { Socket, io } from "socket.io-client";
// import { useAppContext } from "./AppContext";
// import { SocketEvent, SocketContext as SocketContextType, SocketId } from "@/types/socket";
// import { RemoteUser, USER_STATUS, User } from "@/types/user";
// import { DrawingData } from "@/types/app";

// // Create the SocketContext
// const SocketContext = createContext<SocketContextType | null>(null);

// export const useSocket = (): SocketContextType => {
//     const context = useContext(SocketContext);
//     if (!context) {
//         throw new Error("useSocket must be used within a SocketProvider");
//     }
//     return context;
// };

// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// const SocketProvider = ({ children }: { children: ReactNode }) => {
//     const { users, setUsers, setStatus, setCurrentUser, drawingData, setDrawingData } = useAppContext();

//     const [localStream, setLocalStream] = useState<MediaStream | null>(null);
//     const [remoteStreams, setRemoteStreams] = useState<{ [socketId: string]: MediaStream }>({});
//     const [isMediaAccessEnabled, setIsMediaAccessEnabled] = useState(false); // Control media access

//     const peerConnections: { [socketId: string]: RTCPeerConnection } = useMemo(() => ({}), []);
//     const socket: Socket = useMemo(() => io(BACKEND_URL, { reconnectionAttempts: 2 }), []);

//     const handleError = useCallback(
//         (err: any) => {
//             console.log("socket error", err);
//             setStatus(USER_STATUS.CONNECTION_FAILED);
//             toast.dismiss();
//             toast.error("Failed to connect to the server");
//         },
//         [setStatus]
//     );

//     const handleUsernameExist = useCallback(() => {
//         toast.dismiss();
//         setStatus(USER_STATUS.INITIAL);
//         toast.error("The username you chose already exists in the room. Please choose a different username.");
//     }, [setStatus]);

//     const handleJoiningAccept = useCallback(
//         ({ user, users }: { user: User; users: RemoteUser[] }) => {
//             setCurrentUser(user);
//             setUsers(users);
//             toast.dismiss();
//             setStatus(USER_STATUS.JOINED);

//             if (users.length > 1) {
//                 toast.loading("Syncing data, please wait...");
//             }

//             // Enable media access after successful room join
//             setIsMediaAccessEnabled(true); // This flag will trigger media access in the next effect
//         },
//         [setCurrentUser, setStatus, setUsers]
//     );

//     const handleUserLeft = useCallback(
//         ({ user }: { user: User }) => {
//             toast.success(`${user.username} left the room`);
//             setUsers(users.filter((u: RemoteUser) => u.username !== user.username));
//             if (peerConnections[user.socketId]) {
//                 peerConnections[user.socketId].close();
//                 delete peerConnections[user.socketId];
//             }
//         },
//         [setUsers, users, peerConnections]
//     );

//     const handleRequestDrawing = useCallback(
//         ({ socketId }: { socketId: SocketId }) => {
//             socket.emit(SocketEvent.SYNC_DRAWING, { socketId, drawingData });
//         },
//         [drawingData, socket]
//     );

//     const handleDrawingSync = useCallback(
//         ({ drawingData }: { drawingData: DrawingData }) => {
//             setDrawingData(drawingData);
//         },
//         [setDrawingData]
//     );

//     // Setup WebRTC for peer-to-peer video/audio
//     useEffect(() => {
//         // Only access media devices after successful room join
//         if (isMediaAccessEnabled) {
//             navigator.mediaDevices
//                 .getUserMedia({ video: true, audio: true })
//                 .then((stream) => {
//                     setLocalStream(stream);
//                     toast.success("");
//                 })
//                 .catch((err) => {
//                     console.error("Error accessing media devices:", err);
//                     toast.error("Unable to access media devices");
//                 });
//         }
//     }, [isMediaAccessEnabled]); // Depend on isMediaAccessEnabled state

//     const createPeerConnection = useCallback(
//         (socketId: string) => {
//             const peerConnection = new RTCPeerConnection();

//             // Add local media tracks to the peer connection
//             localStream?.getTracks().forEach((track) => peerConnection.addTrack(track, localStream));

//             // Handle receiving remote streams
//             peerConnection.ontrack = (event) => {
//                 setRemoteStreams((prevStreams) => ({
//                     ...prevStreams,
//                     [socketId]: event.streams[0],
//                 }));
//             };

//             // Handle ICE candidates
//             peerConnection.onicecandidate = (event) => {
//                 if (event.candidate) {
//                     socket.emit(SocketEvent.ICE_CANDIDATE, { socketId, candidate: event.candidate });
//                 }
//             };

//             return peerConnection;
//         },
//         [localStream, socket]
//     );

//     // Handle socket events related to WebRTC
//     useEffect(() => {
//         socket.on("connect_error", handleError);
//         socket.on("connect_failed", handleError);
//         socket.on(SocketEvent.USERNAME_EXISTS, handleUsernameExist);
//         socket.on(SocketEvent.JOIN_ACCEPTED, handleJoiningAccept);
//         socket.on(SocketEvent.USER_DISCONNECTED, handleUserLeft);
//         socket.on(SocketEvent.REQUEST_DRAWING, handleRequestDrawing);
//         socket.on(SocketEvent.SYNC_DRAWING, handleDrawingSync);

//         // Handle receiving WebRTC offers
//         socket.on(SocketEvent.OFFER, async ({ socketId, offer }) => {
//             const peerConnection = createPeerConnection(socketId);
//             await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
//             const answer = await peerConnection.createAnswer();
//             await peerConnection.setLocalDescription(answer);
//             socket.emit(SocketEvent.ANSWER, { socketId, answer });
//             peerConnections[socketId] = peerConnection;
//         });

//         // Handle receiving WebRTC answers
//         socket.on(SocketEvent.ANSWER, async ({ socketId, answer }) => {
//             const peerConnection = peerConnections[socketId];
//             if (peerConnection) {
//                 await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
//             }
//         });

//         // Handle receiving ICE candidates
//         socket.on(SocketEvent.ICE_CANDIDATE, ({ socketId, candidate }) => {
//             const peerConnection = peerConnections[socketId];
//             if (peerConnection) {
//                 peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
//             }
//         });

//         return () => {
//             socket.off("connect_error");
//             socket.off("connect_failed");
//             socket.off(SocketEvent.USERNAME_EXISTS);
//             socket.off(SocketEvent.JOIN_ACCEPTED);
//             socket.off(SocketEvent.USER_DISCONNECTED);
//             socket.off(SocketEvent.REQUEST_DRAWING);
//             socket.off(SocketEvent.SYNC_DRAWING);
//             socket.off(SocketEvent.OFFER);
//             socket.off(SocketEvent.ANSWER);
//             socket.off(SocketEvent.ICE_CANDIDATE);
//         };
//     }, [
//         handleDrawingSync,
//         handleError,
//         handleJoiningAccept,
//         handleRequestDrawing,
//         handleUserLeft,
//         handleUsernameExist,
//         peerConnections,
//         createPeerConnection,
//         socket,
//     ]);

//     return (
//         <SocketContext.Provider value={{ socket, localStream, remoteStreams }}>
//             {children}
//         </SocketContext.Provider>
//     );
// };

// export { SocketProvider };
//export default SocketContext;
