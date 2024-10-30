// VideoView.tsx
import { useRef, useEffect } from "react";

const VideoView = () => {
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        // Add your video streaming logic here (e.g., WebRTC setup)
        const startLocalStream = async () => {
            try {
                const localStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = localStream;
                }
            } catch (error) {
                console.error("Error accessing media devices:", error);
            }
        };

        startLocalStream();
    }, []);

    return (
        <div className="flex flex-col items-center gap-2 p-4">
            <h1 className="view-title">Video Chat</h1>
            <div className="relative w-full">
                <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    style={{ width: "100%", height: "auto", border: "1px solid #fff" }}
                />
                <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    style={{ width: "100%", height: "auto", border: "1px solid #fff" }}
                />
            </div>
        </div>
    );
};

export default VideoView;
