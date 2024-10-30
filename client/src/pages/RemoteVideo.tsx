import React, { useEffect, useRef } from 'react';

interface RemoteVideoProps {
    key: string; // You can change this based on your needs
    stream: MediaStream; // Pass in the MediaStream for the video
}

const RemoteVideo: React.FC<RemoteVideoProps> = ({ key, stream }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream; // Set the srcObject directly on the video element
            videoRef.current.play(); // Start playing the video
        }

        return () => {
            if (videoRef.current) {
                videoRef.current.srcObject = null; // Clean up when the component unmounts
            }
        };
    }, [stream]);

    return (
        <video
            key={key}
            ref={videoRef} // Assign the ref to the video element
            autoPlay
            playsInline
            style={{ width: '100%', height: 'auto' }} // You can customize the styles as needed
        />
    );
};

export default RemoteVideo;
