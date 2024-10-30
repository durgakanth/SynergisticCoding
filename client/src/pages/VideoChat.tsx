// import { useEffect, useRef, useState } from 'react';
// import { io, Socket } from 'socket.io-client';

// interface OfferMessage {
//   offer: RTCSessionDescriptionInit;
//   fromSocketId: string;
// }

// const VideoChat = () => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
//   const localVideoRef = useRef<HTMLVideoElement | null>(null);
//   const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
//   const localStreamRef = useRef<MediaStream | null>(null);
//   const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
//   const [isVideoEnabled, setIsVideoEnabled] = useState(false); // State for video

//   const config = {
//     iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
//   };

//   useEffect(() => {
//     const newSocket = io();
//     setSocket(newSocket);

//     newSocket.on('webrtc-offer', handleReceiveOffer);
//     newSocket.on('webrtc-answer', handleReceiveAnswer);
//     newSocket.on('webrtc-ice-candidate', handleReceiveICECandidate);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   const startLocalStream = async () => {
//     try {
//       const localStream = await navigator.mediaDevices.getUserMedia({
//         video: true,
//         audio: true,
//       });

//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = localStream;
//         localStreamRef.current = localStream;
//       } else {
//         console.error('Local video reference is null');
//       }
//     } catch (error) {
//       console.error('Error accessing media devices:', error);
//     }
//   };

//   const disableLocalStream = () => {
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => track.stop());
//       localStreamRef.current = null;
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = null;
//       }
//     }
//     setIsVideoEnabled(false);
//     // Allow scrolling again
//     document.body.style.overflow = 'auto';
//   };

//   const createPeerConnection = () => {
//     const peerConnection = new RTCPeerConnection(config);

//     localStreamRef.current?.getTracks().forEach((track) => {
//       peerConnection.addTrack(track, localStreamRef.current!);
//     });

//     peerConnection.ontrack = (event) => {
//       if (remoteVideoRef.current && event.streams[0]) {
//         remoteVideoRef.current.srcObject = event.streams[0];
//       }
//     };

//     peerConnection.onicecandidate = (event) => {
//       if (event.candidate && remoteSocketId) {
//         socket?.emit('webrtc-ice-candidate', {
//           candidate: event.candidate,
//           targetSocketId: remoteSocketId,
//         });
//       }
//     };

//     peerConnectionRef.current = peerConnection;
//   };

//   const handleReceiveOffer = async ({ offer, fromSocketId }: OfferMessage) => {
//     setRemoteSocketId(fromSocketId);
//     createPeerConnection();

//     await peerConnectionRef.current?.setRemoteDescription(
//       new RTCSessionDescription(offer)
//     );
//     const answer = await peerConnectionRef.current?.createAnswer();
//     await peerConnectionRef.current?.setLocalDescription(answer);

//     socket?.emit('webrtc-answer', {
//       answer: peerConnectionRef.current?.localDescription,
//       targetSocketId: fromSocketId,
//     });
//   };

//   const handleReceiveAnswer = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
//     await peerConnectionRef.current?.setRemoteDescription(
//       new RTCSessionDescription(answer)
//     );
//   };

//   const handleReceiveICECandidate = ({ candidate }: { candidate: RTCIceCandidateInit }) => {
//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
//     }
//   };

//   const startCall = async (targetSocketId: string) => {
//     setRemoteSocketId(targetSocketId);
//     createPeerConnection();

//     const offer = await peerConnectionRef.current?.createOffer();
//     await peerConnectionRef.current?.setLocalDescription(offer);

//     socket?.emit('webrtc-offer', {
//       offer: peerConnectionRef.current?.localDescription,
//       targetSocketId: targetSocketId,
//     });
//   };

//   const enableVideo = () => {
//     startLocalStream();
//     setIsVideoEnabled(true);
//     // Disable scrolling when video is enabled
//    // document.body.style.overflow = 'hidden';
//   };

//   return (
//     <div style={{ position: 'relative', height: '100vh' }}>
//       <div>
//         {/* Drawing tool and other elements */}
//         <div className="drawing-tool">
//           {/* Drawing tool here */}
//         </div>

//         {/* Buttons for enabling/disabling video */}
//         {!isVideoEnabled ? (
//           <button onClick={enableVideo}>Enable Video</button>
//         ) : (
//           <button onClick={disableLocalStream}>Disable Video</button>
//         )}
//       </div>

//       {/* Video Display */}
//       {isVideoEnabled && (
//         <div>
//           {/* Remote video */}
//           <video ref={remoteVideoRef} autoPlay playsInline style={{ display: 'none' }} />

//           {/* Local video preview fixed at the corner */}
//           <div style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
//             <video
//               ref={localVideoRef}
//               autoPlay
//               playsInline
//               muted
//               style={{
//                 width: '150px',
//                 height: '100px',
//                 border: '2px solid #000',
//                 borderRadius: '10px',
//                 zIndex: 1000,
//               }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoChat;


import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface OfferMessage {
  offer: RTCSessionDescriptionInit;
  fromSocketId: string;
}

const VideoChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [remoteSocketId, setRemoteSocketId] = useState<string | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false); // State for video

  const config = {
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
  };

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);

    newSocket.on('webrtc-offer', handleReceiveOffer);
    newSocket.on('webrtc-answer', handleReceiveAnswer);
    newSocket.on('webrtc-ice-candidate', handleReceiveICECandidate);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const startLocalStream = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
        localStreamRef.current = localStream;
      } else {
        console.error('Local video reference is null');
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  const disableLocalStream = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    }
    setIsVideoEnabled(false);
    document.body.style.overflow = 'auto'; // Allow scrolling again
  };

  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection(config);

    localStreamRef.current?.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStreamRef.current!);
    });

    peerConnection.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && remoteSocketId) {
        socket?.emit('webrtc-ice-candidate', {
          candidate: event.candidate,
          targetSocketId: remoteSocketId,
        });
      }
    };

    peerConnectionRef.current = peerConnection;
  };

  const handleReceiveOffer = async ({ offer, fromSocketId }: OfferMessage) => {
    setRemoteSocketId(fromSocketId);
    createPeerConnection();

    await peerConnectionRef.current?.setRemoteDescription(
      new RTCSessionDescription(offer)
    );
    const answer = await peerConnectionRef.current?.createAnswer();
    await peerConnectionRef.current?.setLocalDescription(answer);

    socket?.emit('webrtc-answer', {
      answer: peerConnectionRef.current?.localDescription,
      targetSocketId: fromSocketId,
    });
  };

  const handleReceiveAnswer = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
    await peerConnectionRef.current?.setRemoteDescription(
      new RTCSessionDescription(answer)
    );
  };

  const handleReceiveICECandidate = ({ candidate }: { candidate: RTCIceCandidateInit }) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
  };

  const startCall = async (targetSocketId: string) => {
    setRemoteSocketId(targetSocketId);
    createPeerConnection();

    const offer = await peerConnectionRef.current?.createOffer();
    await peerConnectionRef.current?.setLocalDescription(offer);

    socket?.emit('webrtc-offer', {
      offer: peerConnectionRef.current?.localDescription,
      targetSocketId: targetSocketId,
    });
  };

  const enableVideo = () => {
    startLocalStream();
    setIsVideoEnabled(true);
    // Disable scrolling when video is enabled
    //document.body.style.overflow = 'hidden';
  };

  return (
    <div style={{ position: 'relative', height: '100vh' }}>
      <div className="sidebar">
        {/* Drawing tool and other elements */}
        <div className="drawing-tool">
          {/* Drawing tool here */}
        </div>

        {/* Buttons for enabling/disabling video */}
        {/* <button className="open-file">Open File/Folder</button>
        <button className="download-code">Download Code</button> */}

      {/* Buttons for enabling/disabling video with icon and left alignment */}
{!isVideoEnabled ? (
  <button
    className="toggle-video"
    onClick={enableVideo}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      marginLeft: '10px',
      backgroundColor: '#4CAF50',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
    }}
  >
    <i
      className="small-video-icon"
      style={{
        marginRight: '8px',
        display: 'inline-block',
        width: '16px',
        height: '16px',
        backgroundColor: '#fff',
        borderRadius: '50%',
      }}
    ></i>
    Enable Video
  </button>
) : (
  <button
    className="toggle-video"
    onClick={disableLocalStream}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      marginLeft: '10px',
      backgroundColor: '#f44336',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '16px',
    }}
  >
    <i
      className="small-video-icon"
      style={{
        marginRight: '8px',
        display: 'inline-block',
        width: '16px',
        height: '16px',
        backgroundColor: '#fff',
        borderRadius: '50%',
      }}
    ></i>
    Disable Video
  </button>
)}

      </div>

      {/* Video Display */}
      {isVideoEnabled && (
        <div>
          {/* Remote video */}
          <video ref={remoteVideoRef} autoPlay playsInline style={{ display: 'none' }} />

          {/* Local video preview fixed at the corner */}
          <div style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '150px',
                height: '100px',
                border: '2px solid #000',
                borderRadius: '10px',
                zIndex: 1000,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoChat;

