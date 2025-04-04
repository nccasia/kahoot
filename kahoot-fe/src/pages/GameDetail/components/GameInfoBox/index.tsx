import Button from "@/components/Button";
import SocketEvents from "@/constants/SocketEvents";
import { IGame } from "@/interfaces/gameTypes";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import { useSocket } from "@/providers/SocketProvider";
import roomServices from "@/services/roomServices";
import GameActions from "@/stores/gameStore/gameAction";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

interface GameInfoBoxProps {
  gameInfo?: IGame | null;
  totalQuestion?: number;
  owner?: string;
}
const GameInfoBox = ({ gameInfo, totalQuestion, owner }: GameInfoBoxProps) => {
  const navigate = useNavigate();
  const socket = useSocket();
  const { gameDispatch } = useContext(GameContext);
  const handleBackToListGame = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };
  const joinRoom = (roomCode: string) => {
    if (!socket) return;
    socket.emit(SocketEvents.EMIT.ClientEmitJoinRoom, { roomCode });
  };
  const createNewGame = async () => {
    // create new game
    if (!gameInfo?.id) {
      return;
    }
    try {
      const response = await roomServices.createRoom(gameInfo?.id ?? "");
      if (!(response.statusCode === 200 || response.statusCode === 201)) {
        console.log("error", response);
        return;
      }
      const roomCode = response.data.code;
      // navigate(ROUTES.WAITING_ROOM.replace(":roomId", roomId));
      joinRoom(roomCode);
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleGoToLastRoom = () => {
    joinRoom(gameInfo?.lastRoom?.code ?? "");
  };
  const handleDeleteGame = () => {
    gameDispatch(GameActions.changeSelectedGameId(gameInfo?.id ?? ""));
    gameDispatch(GameActions.changeOpenModalConfirmDeleteGame(true));
  };
  return (
    <div className='left-box max-w-[350px] p-2 w-full border-r-2 border-[#1C0C8E] bg-[#6b00e78a]'>
      <div className='flex justify-center font-coiny text-xl items-center min-h-[60px] border-b-2 border-[#1C0C8E] py-2'>
        <span>{gameInfo?.name}</span>
      </div>
      <div className='flex flex-col gap-3 p-2 justify-center items-center'>
        <div className='flex gap-3 w-full'>
          <Button onClick={handleBackToListGame} className='text-center bg-[#e93d3d] font-coiny text-lg w-full max-w-[270px]'>
            Quay lại
          </Button>
          <Button onClick={handleDeleteGame} className='text-center bg-[#ded525] font-coiny text-lg w-full max-w-[270px]'>
            Xoá Game
          </Button>
        </div>
        <Button onClick={createNewGame} className='text-center bg-[#6BB3E0] font-coiny text-lg w-full'>
          Bắt đầu game mới
        </Button>
      </div>
      <div className='font-coiny mt-5'>
        <div className='flex justify-between items-center mt-3'>
          <span className='mr-2'>Tổng số câu hỏi:</span>
          <span>{totalQuestion ?? 0}</span>
        </div>
        <div className='flex justify-between items-center mt-3'>
          <span className='mr-2'>Chủ phòng:</span>
          <span>{owner}</span>
        </div>
        <div className='flex justify-between items-center mt-3'>
          <span className='mr-2'>Mật khẩu phòng:</span>
          <span>******</span>
        </div>
        <div className='flex justify-between items-center mt-3'>
          <span className='mr-2'>Phòng hiện tại:</span>
          {gameInfo?.lastRoom && gameInfo.lastRoom.status === "waiting" ? (
            <span className='cursor-pointer animate-pulse hover:text-[#dcd02b]' onClick={handleGoToLastRoom}>
              {gameInfo?.lastRoom.code}
            </span>
          ) : (
            <span>Chưa bắt đầu</span>
          )}
        </div>
      </div>
    </div>
  );
};
export default GameInfoBox;
