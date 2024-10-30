import { useEffect, useRef } from "react"
import { useSocket } from "@/context/SocketContext"

const LocalVideo = () => {
    const { localStream } = useSocket()
    const localVideoRef = useRef<HTMLVideoElement | null>(null)

    useEffect(() => {
        if (localVideoRef.current && localStream) {
            localVideoRef.current.srcObject = localStream
        }
    }, [localStream])

    return (
        <div>
            <video ref={localVideoRef} autoPlay playsInline muted />
        </div>
    )
}

export default LocalVideo
