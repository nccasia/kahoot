import LoadingOverlay from "@/components/LoadingOverlay";
import SocketEvents from "@/constants/SocketEvents";
import { useSocket } from "@/providers/SocketProvider";
import { ROUTES } from "@/routes/routePath";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PlayGame = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const socket = useSocket();

    useEffect(() => {
        const roomCode = searchParams.get("code") || searchParams.get("roomId"); 
        if (!socket) {
            navigate(ROUTES.HOME);
            return;
        }
        if (!roomCode) {
            navigate(ROUTES.SEARCH_ROOM);
            return;
        }
        const timeoutId = setTimeout(() => {
            socket.emit(SocketEvents.EMIT.ClientEmitJoinRoom, { roomCode: roomCode });
        }, 5000);
        return () => {
            clearTimeout(timeoutId);
        };
    }, [socket, searchParams, navigate]);
    return (
        <div className="relative max-w-[1200px] w-full h-full p-2">
            <LoadingOverlay
                title={
                    <span>
                        Đang tham gia trò chơi <br /> vui lòng đợi trong giây lát!
                    </span>
                }
            />
        </div>
    );
}

export default PlayGame;