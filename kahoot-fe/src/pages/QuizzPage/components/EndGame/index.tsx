import SocketEvents from "@/constants/SocketEvents";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import { RoomContext } from "@/providers/ContextProvider/RoomProvider";
import { useSocket } from "@/providers/SocketProvider";
import { ROUTES } from "@/routes/routePath";
import roomServices from "@/services/roomServices";
import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import ListRank from "./ListRank";
import TopRank from "./TopRank";

const EndGame = () => {
  const { roomState } = useContext(RoomContext);
  const { gameState } = useContext(GameContext);
  const navigate = useNavigate();
  const socket = useSocket();
  const top3 = useMemo(() => {
    return roomState.userRanking?.slice(0, 3);
  }, [roomState.userRanking]);
  console.log("current room state", roomState.currentRoom);
  const handleOutGame = () => {
    navigate(ROUTES.HOME);
  };
  const joinRoom = (roomCode: string) => {
    if (!socket) return;
    socket.emit(SocketEvents.EMIT.ClientEmitJoinRoom, { roomCode });
  };
  const handlePlayAgain = async () => {
    if (!socket || !gameState.currentGameId || !roomState.isOwner) {
      return;
    }
    try {
      const response = await roomServices.createRoom(gameState.currentGameId ?? "");
      if (!(response.statusCode === 200 || response.statusCode === 201)) {
        console.log("error", response);
        return;
      }
      const roomCode = response.data.code;
      joinRoom(roomCode);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <div
      className='backdrop-blur-md loading-overlay fixed z-50 top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-40 fadeIn'
      style={{ animationDelay: "unset", animationDuration: "0.3s" }}
    >
      <div className='max-w-[800px] w-[100%] h-full p-2'>
        <div
          style={{ animationDelay: "unset" }}
          className='p-4 flex bg-[#191c4970] flex-col items-center h-[calc(100%-40px)] mt-[20px] shadow-xl rounded-[10px] overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent'
        >
          <Header onOutGame={handleOutGame} onPlayAgain={handlePlayAgain} isOwner={roomState.isOwner} />
          <TopRank top3={top3} />
          <ListRank totalQuestion={roomState.totalQuestion ?? 1} userRankings={roomState.userRanking} />
        </div>
      </div>
    </div>
  );
};
export default EndGame;
