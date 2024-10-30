// enum USER_CONNECTION_STATUS {
//     OFFLINE = "offline",
//     ONLINE = "online",
// }

// interface User {
//     username: string
//     roomId: string
// }
// export interface User {
//     username: string
//     socketId: string // Add this to your type definition
//     status: string
// }


// interface RemoteUser extends User {
//     status: USER_CONNECTION_STATUS
//     cursorPosition: number
//     typing: boolean
//     currentFile: string
//     socketId: string
// }

// enum USER_STATUS {
//     INITIAL = "initial",
//     CONNECTING = "connecting",
//     ATTEMPTING_JOIN = "attempting-join",
//     JOINED = "joined",
//     CONNECTION_FAILED = "connection-failed",
//     DISCONNECTED = "disconnected",
// }

// export { USER_CONNECTION_STATUS, USER_STATUS, RemoteUser, User }

enum USER_CONNECTION_STATUS {
    OFFLINE = "offline",
    ONLINE = "online",
}

interface User {
    username: string;
    roomId: string;
    socketId: string; // Required property
    status: USER_STATUS; // Assuming this is an enum or similar
}


interface RemoteUser extends User {
    status: USER_CONNECTION_STATUS // Enum status for RemoteUser
    cursorPosition: number // Position of the cursor (for collaborative typing)
    typing: boolean // Boolean to track if the user is typing
    currentFile: string // The file the user is currently editing
}

enum USER_STATUS {
    INITIAL = "initial",
    CONNECTING = "connecting",
    ATTEMPTING_JOIN = "attempting-join",
    JOINED = "joined",
    CONNECTION_FAILED = "connection-failed",
    DISCONNECTED = "disconnected",
    CONNECTED = "CONNECTED",
 
}

export { USER_CONNECTION_STATUS, USER_STATUS, RemoteUser, User }

