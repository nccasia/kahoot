import Button from "@/components/Button";
import ModalGameTimer from "@/components/Modal/ModalGameTimer";
import SocketEvents from "@/constants/SocketEvents";
import { IGame } from "@/interfaces/gameTypes";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import { useSocket } from "@/providers/SocketProvider";
import roomServices from "@/services/roomServices";
import GameActions from "@/stores/gameStore/gameAction";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
interface GameInfoBoxProps {
  gameInfo?: IGame | null;
  totalQuestion?: number;
  owner?: string;
  onDeleteRoom: (roomId: string) => void;
}
const GameInfoBox = ({ gameInfo, totalQuestion, owner, onDeleteRoom }: GameInfoBoxProps) => {
  const navigate = useNavigate();
  const socket = useSocket();
  const { gameDispatch, gameState } = useContext(GameContext);
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
  useEffect(() => {
    if (!gameInfo) return;
    if (gameInfo?.lastRoom?.code) {
      const roomCode = gameInfo?.lastRoom?.code;
      console.log("gameInfo", roomCode);
    }
  }, [gameInfo]);
  const createNewGame = async () => {
    if (!socket) return;
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
      joinRoom(roomCode);
    } catch (error) {
      console.log("error", error);
    }
  };
  const [openModalGameTimer, setOpenModalGameTimer] = useState(false);
  const handlecreateGameTimer = () => {
    setOpenModalGameTimer(true);
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
            Xoá game
          </Button>
        </div>
        <div className="flex gap-3 w-full">
          <Button onClick={createNewGame} className='text-center bg-[#6BB3E0] font-coiny text-lg w-full'>
            Game mới
          </Button>
          {openModalGameTimer && (
            <ModalGameTimer isOpen={openModalGameTimer} onClose={() => setOpenModalGameTimer(false)} title="Hẹn Giờ Chơi" onConfirm={handlecreateGameTimer}></ModalGameTimer>
          )}
        </div>
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
        <div className="mt-6">
          <span className='mr-2'>Các phòng đã tạo</span>
          <div className="mt-2 flex flex-col  ">
            <div className="overflow-y-auto w-full h-[calc(100vh-320px)] sm:h-[calc(100vh-260px)] 
            [&::-webkit-scrollbar]:w-[3px] 
            [&::-webkit-scrollbar-thumb]:bg-transparent 
            [&::-webkit-scrollbar-thumb]:rounded-lg 
            [&::-webkit-scrollbar-track]:bg-transparent">

              {gameState.listRooms.length === 0 ? (
                <Button onClick={createNewGame} className="bg-[#054e7a]">Chưa có phòng nào được tạo<br /> Tạo Phòng Ngay?</Button>
              ) : (
                gameState.listRooms.map(room => (
                  <div className="flex justify-between gap-2 items-center mt-3" key={room.id}>
                    <div className="flex justify-stretch  ">
                      <span>Tên phòng: <span
                        className='cursor-pointer text-[#ffee8df6] font-coiny text-lg'
                        onClick={() => joinRoom(room.code)}
                      >
                        {room.code}
                      </span> </span>
                      <span className="font-medium">
                        Trạng thái:{" "}
                        <span
                          className={`font-semibold ${room.status === "waiting" ? "text-[#51d6ff]" : "text-red-400"
                            }`}
                        >
                          {room.status}
                        </span>
                      </span>
                      <div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handlecreateGameTimer}
                        className="!bg-transparent !p-1 !min-w-0 !shadow-none !rounded-none hover:!translate-x-0 hover:!translate-y-0 hover:!shadow-none active:!shadow-none"
                      >
                        <img src="/icons/timer-icon.png" alt="Timer" className="min-w-7 w-7 h-7" />
                      </Button>

                      <Button
                        onClick={() => onDeleteRoom(room.id)}
                        className="!bg-transparent !p-1 !min-w-0 !shadow-none !rounded-none hover:!translate-x-0 hover:!translate-y-0 hover:!shadow-none active:!shadow-none"
                      >
                        <img src="/icons/remove.png" alt="Remove" className="min-w-7 w-7 h-7" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default GameInfoBox;
