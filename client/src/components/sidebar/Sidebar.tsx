// import SidebarButton from "@/components/sidebar/sidebar-views/SidebarButton"
// import { useAppContext } from "@/context/AppContext"
// import { useSocket } from "@/context/SocketContext"
// import { useViews } from "@/context/ViewContext"
// import useResponsive from "@/hooks/useResponsive"
// import useWindowDimensions from "@/hooks/useWindowDimensions"
// import { ACTIVITY_STATE } from "@/types/app"
// import { SocketEvent } from "@/types/socket"
// import { VIEWS } from "@/types/view"
// import { IoCodeSlash } from "react-icons/io5"
// import { MdOutlineDraw } from "react-icons/md"
// import cn from "classnames"

// function Sidebar() {
//     const {
//         activeView,
//         isSidebarOpen,
//         viewComponents,
//         viewIcons,
//         setIsSidebarOpen,
//     } = useViews()
//     const { minHeightReached } = useResponsive()
//     const { activityState, setActivityState } = useAppContext()
//     const { socket } = useSocket()
//     const { isMobile } = useWindowDimensions()

//     const changeState = () => {
//         if (activityState === ACTIVITY_STATE.CODING) {
//             setActivityState(ACTIVITY_STATE.DRAWING)
//             socket.emit(SocketEvent.REQUEST_DRAWING)
//         } else {
//             setActivityState(ACTIVITY_STATE.CODING)
//         }

//         if (isMobile) {
//             setIsSidebarOpen(false)
//         }
//     }

//     return (
//         <aside className="flex w-full md:h-full md:max-h-full md:min-h-full md:w-auto">
//             <div
//                 className={cn(
//                     "fixed bottom-0 left-0 z-50 flex h-[50px] w-full gap-6 self-end overflow-auto border-t border-darkHover bg-dark p-3 md:static md:h-full md:w-[50px] md:min-w-[50px] md:flex-col md:border-r md:border-t-0 md:p-2 md:pt-4",
//                     {
//                         hidden: minHeightReached,
//                     },
//                 )}
//             >
//                 <SidebarButton
//                     viewName={VIEWS.FILES}
//                     icon={viewIcons[VIEWS.FILES]}
//                 />
//                 <SidebarButton
//                     viewName={VIEWS.CHATS}
//                     icon={viewIcons[VIEWS.CHATS]}
//                 />
//                 <SidebarButton
//                     viewName={VIEWS.RUN}
//                     icon={viewIcons[VIEWS.RUN]}
//                 />
//                 <SidebarButton
//                     viewName={VIEWS.CLIENTS}
//                     icon={viewIcons[VIEWS.CLIENTS]}
//                 />
//                 <SidebarButton
//                     viewName={VIEWS.SETTINGS}
//                     icon={viewIcons[VIEWS.SETTINGS]}
//                 />

//                 {/* Button to change activity state coding or drawing */}
//                 <button className="self-end" onClick={changeState}>
//                     {activityState === ACTIVITY_STATE.CODING ? (
//                         <MdOutlineDraw size={30} />
//                     ) : (
//                         <IoCodeSlash size={30} />
//                     )}
//                 </button>
//             </div>
//             <div
//                 className="absolute left-0 top-0 z-20 w-full flex-grow flex-col bg-dark md:static md:w-[300px]"
//                 style={isSidebarOpen ? {} : { display: "none" }}
//             >
//                 {/* Render the active view component */}
//                 {viewComponents[activeView]}
//             </div>
//         </aside>
//     )
// }

// export default Sidebar

// import { useEffect, useState, useRef } from 'react';
// import { MdMeetingRoom } from "react-icons/md"; // Import an icon for joining room
// //import { FaVideo, FaVideoSlash } from 'react-icons/fa'; // Import video on and off icons
// import SidebarButton from "@/components/sidebar/sidebar-views/SidebarButton";
// import { useAppContext } from "@/context/AppContext";
// import { useSocket } from "@/context/SocketContext";
// import { useViews } from "@/context/ViewContext";

// import useResponsive from "@/hooks/useResponsive";
// import useWindowDimensions from "@/hooks/useWindowDimensions";
// import { ACTIVITY_STATE } from "@/types/app";
// import { SocketEvent } from "@/types/socket";
// import { VIEWS } from "@/types/view";
// import { IoCodeSlash } from "react-icons/io5";
// import { MdOutlineDraw } from "react-icons/md";
// import cn from "classnames";

// function Sidebar() {
//     const { activeView, isSidebarOpen, viewComponents, viewIcons, setIsSidebarOpen } = useViews();
//     const { minHeightReached } = useResponsive();
//     const { activityState, setActivityState } = useAppContext();
//     const { socket } = useSocket();
//     const { isMobile } = useWindowDimensions();

//     const [isRoomJoined, setIsRoomJoined] = useState(false); // State for room join status
//     const [isVideoEnabled, setIsVideoEnabled] = useState(false); // State for video status

//     // Track video and stream references
//     const localVideoRef = useRef<HTMLVideoElement | null>(null);
//     const localStreamRef = useRef<MediaStream | null>(null);

//     const changeState = () => {
//         if (activityState === ACTIVITY_STATE.CODING) {
//             setActivityState(ACTIVITY_STATE.DRAWING);
//             socket.emit(SocketEvent.REQUEST_DRAWING);
//         } else {
//             setActivityState(ACTIVITY_STATE.CODING);
//         }

//         if (isMobile) {
//             setIsSidebarOpen(false);
//         }
//     };

//     // Start the local video stream
//     const startLocalStream = async () => {
//         try {
//             const localStream = await navigator.mediaDevices.getUserMedia({
//                 video: true,
//                 audio: true,
//             });

//             if (localVideoRef.current) {
//                 localVideoRef.current.srcObject = localStream;
//                 localStreamRef.current = localStream;
//             } else {
//                 console.error("Local video reference is null");
//             }
//         } catch (error) {
//             console.error("Error accessing media devices:", error);
//         }
//     };

//     // Stop the local video stream
//     const stopLocalStream = () => {
//         if (localStreamRef.current) {
//             localStreamRef.current.getTracks().forEach(track => track.stop());
//             localStreamRef.current = null;
//         }
//     };

//     const joinRoom = () => {
//         // Enable the local stream and mark the room as joined
//         startLocalStream();
//         setIsRoomJoined(true);
//     };

//     // Function to enable/disable video when the icon is clicked
//     const toggleVideo = () => {
//         if (isVideoEnabled) {
//             stopLocalStream();
//         } else {
//             startLocalStream();
//         }
//         setIsVideoEnabled(!isVideoEnabled); // Toggle video status
//     };

//     return (
//         <aside className="flex w-full md:h-full md:max-h-full md:min-h-full md:w-auto">
//             <div
//                 className={cn(
//                     "fixed bottom-0 left-0 z-50 flex h-[50px] w-full gap-6 self-end overflow-auto border-t border-darkHover bg-dark p-3 md:static md:h-full md:w-[50px] md:min-w-[50px] md:flex-col md:border-r md:border-t-0 md:p-2 md:pt-4",
//                     {
//                         hidden: minHeightReached,
//                     },
//                 )}
//             >
//                 <SidebarButton viewName={VIEWS.FILES} icon={viewIcons[VIEWS.FILES]} />
//                 <SidebarButton viewName={VIEWS.CHATS} icon={viewIcons[VIEWS.CHATS]} />
//                 <SidebarButton viewName={VIEWS.RUN} icon={viewIcons[VIEWS.RUN]} />
//                 <SidebarButton viewName={VIEWS.CLIENTS} icon={viewIcons[VIEWS.CLIENTS]} />
//                 <SidebarButton viewName={VIEWS.SETTINGS} icon={viewIcons[VIEWS.SETTINGS]} />

//                 {/* Button to change activity state coding or drawing */}
//                 <button className="self-end" onClick={changeState}>
//                     {activityState === ACTIVITY_STATE.CODING ? (
//                         <MdOutlineDraw size={30} />
//                     ) : (
//                         <IoCodeSlash size={30} />
//                     )}
//                 </button>

//                 {/* Join Room Button */}
//                 <button className="self-end" onClick={joinRoom}>
//                     <MdMeetingRoom size={30} />
//                      {/* Room Icon */}
//                 </button>
//             </div>

//             <div
//                 className="absolute left-0 top-0 z-20 w-full flex-grow flex-col bg-dark md:static md:w-[300px]"
//                 style={isSidebarOpen ? {} : { display: "none" }}
//             >
//                 {/* Render the active view component */}
//                 {viewComponents[activeView]}
//             </div>

//             {/* Video Enable/Disable Button at the end of sidebar */}
//             {/* <button className="fixed bottom-5 left-5 z-50" onClick={toggleVideo}>
//                 {isVideoEnabled ? (
//                     <FaVideo size={30} color="blue" /> // Video enabled icon
//                 ) : (
//                     <FaVideoSlash size={30} color="red" /> // Video disabled icon
//                 )}
//             </button> */}
//         </aside>
//     );
// }

// export default Sidebar;




import { useState, useRef } from 'react';
import { MdMeetingRoom } from "react-icons/md"; // Import an icon for joining room
import SidebarButton from "@/components/sidebar/sidebar-views/SidebarButton";
import { useAppContext } from "@/context/AppContext";
import { useSocket } from "@/context/SocketContext";
import { useViews } from "@/context/ViewContext";
import VideoView from "@/components/sidebar/sidebar-views/VideoView"; // Import VideoView
import useResponsive from "@/hooks/useResponsive";
import useWindowDimensions from "@/hooks/useWindowDimensions";
import { ACTIVITY_STATE } from "@/types/app";
import { SocketEvent } from "@/types/socket";
import { VIEWS } from "@/types/view";
import { IoCodeSlash } from "react-icons/io5";
import { MdOutlineDraw } from "react-icons/md";
import cn from "classnames";

function Sidebar() {
    const { activeView, isSidebarOpen, viewComponents, viewIcons, setIsSidebarOpen } = useViews();
    const { minHeightReached } = useResponsive();
    const { activityState, setActivityState } = useAppContext();
    const { socket } = useSocket();
    const { isMobile } = useWindowDimensions();

    const [isRoomJoined, setIsRoomJoined] = useState(false); // State for room join status
    const [isVideoEnabled, setIsVideoEnabled] = useState(false); // State for video status

    // Track video and stream references
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const localStreamRef = useRef<MediaStream | null>(null);

    const changeState = () => {
        if (activityState === ACTIVITY_STATE.CODING) {
            setActivityState(ACTIVITY_STATE.DRAWING);
            socket.emit(SocketEvent.REQUEST_DRAWING);
        } else {
            setActivityState(ACTIVITY_STATE.CODING);
        }

        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    // Start the local video stream
    const startLocalStream = async () => {
        try {
            const localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });

            if (localVideoRef.current) {
                localVideoRef.current.srcObject = localStream;
                localStreamRef.current = localStream;
                setIsVideoEnabled(true); // Enable video
            } else {
                console.error("Local video reference is null");
            }
        } catch (error) {
            console.error("Error accessing media devices:", error);
        }
    };

    // Stop the local video stream
    const stopLocalStream = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
            localStreamRef.current = null;
            setIsVideoEnabled(false); // Disable video
        }
    };

    const joinRoom = () => {
        // Start the local video stream and mark the room as joined
        startLocalStream();
        setIsRoomJoined(true);
    };

    // Function to enable/disable video when the icon is clicked
    const toggleVideo = () => {
        if (isVideoEnabled) {
            stopLocalStream();
        } else {
            startLocalStream();
        }
    };

    return (
        <aside className="flex w-full md:h-full md:max-h-full md:min-h-full md:w-auto">
            <div
                className={cn(
                    "fixed bottom-0 left-0 z-50 flex h-[50px] w-full gap-6 self-end overflow-auto border-t border-darkHover bg-dark p-3 md:static md:h-full md:w-[50px] md:min-w-[50px] md:flex-col md:border-r md:border-t-0 md:p-2 md:pt-4",
                    {
                        hidden: minHeightReached,
                    },
                )}
            >
                <SidebarButton viewName={VIEWS.FILES} icon={viewIcons[VIEWS.FILES]} />
                <SidebarButton viewName={VIEWS.CHATS} icon={viewIcons[VIEWS.CHATS]} />
                <SidebarButton viewName={VIEWS.RUN} icon={viewIcons[VIEWS.RUN]} />
                <SidebarButton viewName={VIEWS.CLIENTS} icon={viewIcons[VIEWS.CLIENTS]} />
                <SidebarButton viewName={VIEWS.SETTINGS} icon={viewIcons[VIEWS.SETTINGS]} />

                {/* Button to change activity state coding or drawing */}
                <button className="self-end" onClick={changeState}>
                    {activityState === ACTIVITY_STATE.CODING ? (
                        <MdOutlineDraw size={30} />
                    ) : (
                        <IoCodeSlash size={30} />
                    )}
                </button>

                {/* Join Room Button */}
                
            </div>

            <div
                className="absolute left-0 top-0 z-20 w-full flex-grow flex-col bg-dark md:static md:w-[300px]"
                style={isSidebarOpen ? {} : { display: "none" }}
            >
                {/* Render the active view component, or VideoView if the room is joined */}
                {isRoomJoined ? <VideoView /> : viewComponents[activeView]}
            </div>
        </aside>
    );
}

export default Sidebar;
