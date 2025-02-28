import Button from "@/components/Button";
import SocketEvents from "@/constants/SocketEvents";
import { IGame } from "@/interfaces/gameTypes";
import { useSocket } from "@/providers/SocketProvider";
import roomServices from "@/services/roomServices";
import { useNavigate } from "react-router-dom";

interface GameInfoBoxProps {
  gameInfo?: IGame | null;
  totalQuestion?: number;
}
const GameInfoBox = ({ gameInfo, totalQuestion }: GameInfoBoxProps) => {
  const navigate = useNavigate();
  const socket = useSocket();
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
  return (
    <div className='left-box max-w-[350px] p-2 w-full border-r-2 border-[#1C0C8E] bg-[#6b00e78a]'>
      <div className='flex justify-center font-diablo text-xl items-center min-h-[60px] border-b-2 border-[#1C0C8E] py-2'>
        <span>{gameInfo?.name}</span>
      </div>
      <div className='flex flex-col gap-2 p-2 justify-center items-center'>
        <div className='flex gap-2'>
          <Button onClick={handleBackToListGame} className='text-center bg-[#e93d3d] font-diablo w-full max-w-[250px]'>
            Quay lại
          </Button>
          <Button onClick={() => {}} className='text-center bg-[#ded525] font-diablo w-full max-w-[250px]'>
            Cập nhật
          </Button>
        </div>
        <Button onClick={createNewGame} className='text-center bg-[#6BB3E0] font-diablo w-full max-w-[250px]'>
          Bắt đầu game mới
        </Button>
      </div>
      <div className='font-diablo mt-5'>
        <div className='flex justify-between items-center mt-3'>
          <span className='mr-2'>Tổng số câu hỏi:</span>
          <span>{totalQuestion ?? 0}</span>
        </div>
        <div className='flex justify-between items-center mt-3'>
          <span className='mr-2'>Chủ phòng:</span>
          <span>quyen.nguyenta</span>
        </div>
        <div className='flex justify-between items-center mt-3'>
          <span className='mr-2'>Mật khẩu phòng:</span>
          <span>******</span>
        </div>
        <div className='flex justify-between items-center mt-3'>
          <span className='mr-2'>Phòng hiện tại:</span>
          {gameInfo?.lastRoom ? (
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
