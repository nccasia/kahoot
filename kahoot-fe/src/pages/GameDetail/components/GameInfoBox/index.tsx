import Button from "@/components/Button";
import ModalConfirm from "@/components/Modal/ModalConfirm";
import ModalGameTimer from "@/components/Modal/ModalGameTimer";
import { ERoomStatus, RoomStatus, RoomStatusColor } from "@/constants/RoomStatus";
import SocketEvents from "@/constants/SocketEvents";
import { IGame } from "@/interfaces/gameTypes";
import { ICreateScheduleRoom, IRoom } from "@/interfaces/roomTypes";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import { useSocket } from "@/providers/SocketProvider";
import { ROUTES } from "@/routes/routePath";
import roomServices from "@/services/roomServices";
import GameActions from "@/stores/gameStore/gameAction";
import { HttpStatusCode } from "axios";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
interface GameInfoBoxProps {
  gameInfo?: IGame | null;
  totalQuestion?: number;
  owner?: string;
  onDeleteRoom: (roomId: string) => void;
}
const GameInfoBox = ({ gameInfo, totalQuestion, owner }: GameInfoBoxProps) => {
  const navigate = useNavigate();
  const socket = useSocket();
  const { gameState, gameDispatch } = useContext(GameContext);
  const [openModalGameTimer, setOpenModalGameTimer] = useState(false);
  const [openModalUpdateGameTimer, setOpenModalUpdateGameTimer] = useState(false);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);

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

  const handleCreateGameTimer = async (scheduleData: ICreateScheduleRoom) => {
    if (!gameInfo?.id) {
      return;
    }
    const response = await roomServices.createScheduleRoom(gameInfo?.id, scheduleData)
    if (response.statusCode !== HttpStatusCode.Created) {
      console.log("error", response);
      toast.error("Tạo phòng không thành công");
      return;
    }
    const roomData = response?.data as IRoom;
    gameDispatch(GameActions.addRoom(roomData));
    toast.success("Tạo phòng thành công");
    setOpenModalGameTimer(false);
  };

  const handleUpdateTimer = async (scheduleData: ICreateScheduleRoom, roomId?: string) => {
    if (!roomId) {
      toast.error("Không tìm thấy thông tin phòng");
      return;
    }
    const response = await roomServices.updateScheduledRoom(roomId, scheduleData);
    if (response.statusCode !== HttpStatusCode.Ok) {
      console.log("error", response);
      toast.error("Cập nhật thời gian không thành công");
      return;
    }
    const roomData = response?.data as IRoom;
    gameDispatch(GameActions.updateScheduledRoom(roomData));
    toast.success("Cập nhật thời gian thành công");
    setOpenModalUpdateGameTimer(false);
  }

  const handleCancelSchedule = async (roomId: string) => {
    if (!roomId) {
      toast.error("Không tìm thấy thông tin phòng");
      return;
    }
    const response = await roomServices.cancelScheduledRoom(roomId);
    if (!response || response.statusCode !== HttpStatusCode.Ok) {
      console.log("error", response);
      toast.error("Hủy đặt lịch không thành công");
      setOpenModalConfirm(false)
      return;
    }
    const roomData = response?.data as IRoom;
    gameDispatch(GameActions.updateScheduledRoom(roomData));
    toast.success("Hủy đặt lịch thành công");
    setOpenModalConfirm(false);
  }

  const handleRefreshRoom = async () => {
    if (!gameInfo?.id) {
      return;
    }
    const response = await roomServices.getRoomOfGame(gameInfo.id, 1, 5, "", { createdAt: "desc" });
    if (response.statusCode !== HttpStatusCode.Ok) {
      console.log("error", response);
      return;
    }
    const rooms = response.data;
    gameDispatch(GameActions.changeListRooms(rooms));
  }

  const simulateGame = async () => {
    navigate(ROUTES.SIMULATE_GAME.replace(":gameId", gameInfo?.id ?? ""));
  };

  const handleDeleteGame = () => {
    gameDispatch(GameActions.changeSelectedGameId(gameInfo?.id ?? ""));
    gameDispatch(GameActions.changeOpenModalConfirmDeleteGame(true));
  };
  return (
    <div className='left-box w-full lg:max-w-[350px] p-2 border-r-0 lg:border-r-2 lg:border-r-[#1C0C8E] lg:bg-[#6b00e78a] lg:overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent'>
      <div className='flex justify-center font-coiny text-xl items-center min-h-[60px] border-b-2 border-[#1C0C8E] py-2'>
        <span>{gameInfo?.name}</span>
      </div>
      <div className='flex flex-col gap-3 mt-2 justify-center items-center'>
        <div className='flex gap-3 w-full'>
          <Button
            onClick={handleBackToListGame}
            className='text-center bg-[#e93d3d] font-coiny text-lg w-full'
          >
            Quay lại
          </Button>
          <Button
            onClick={handleDeleteGame}
            className='text-center bg-[#ded525] font-coiny text-lg w-full'
          >
            Xoá game
          </Button>
        </div>
        <div className='flex gap-3 w-full'>
          <Button onClick={simulateGame} className='text-center bg-[#aa37ca] font-coiny text-lg w-full'>
            Chơi thử
          </Button>
          <Button
            onClick={createNewGame}
            className='text-center bg-[#38a34f] font-coiny text-lg w-full'
          >
            Chơi ngay
          </Button>
        </div>
        <div className='flex gap-3 w-full'>
          <Button
            onClick={() => setOpenModalGameTimer(true)}
            className='text-center bg-[#6BB3E0] font-coiny text-lg w-full'
          >
            Tạo phòng
          </Button>
          {openModalGameTimer && (
            <ModalGameTimer
              isOpen={openModalGameTimer}
              onClose={() => setOpenModalGameTimer(false)}
              title="Tạo phòng chơi"
              onConfirm={handleCreateGameTimer}></ModalGameTimer>
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
      </div>
      {
        gameState.listRooms?.length > 0 &&
        <div className="mt-6">
          <div className="flex justify-between items-center">
            <span className='mr-2 font-coiny'>Lịch sử phòng chơi</span>
            <Button
              onClick={handleRefreshRoom}
              className="!bg-transparent !p-1 !min-w-0 !shadow-none !rounded-none hover:!translate-x-0 hover:!translate-y-0 hover:!shadow-none active:!shadow-none hover:rotate-180 transition-transform duration-300"
            >
              <img src="/icons/RefreshIcon_1.png" alt="sync" className="min-w-6 w-6 h-6" />
            </Button>
          </div>
          <div className="mt-2 flex flex-col ">
            <div className="w-full">
              {gameState.listRooms.map((room) => (
                <div className="bg-[#466CF7A1] rounded-xl flex justify-between gap-2 items-center mt-3 p-3" key={room.id}>
                  <div className="flex flex-col items-start gap-[2px]">
                    <span
                      data-tooltip-id="join-room-code"
                      data-tooltip-content="Nhấn để vào phòng"
                      className='cursor-pointer font-coiny text-lg'
                      onClick={() => joinRoom(room.code)}
                    >
                      Phòng: <span className="text-[#ffee8df6]">
                        {room.code}
                      </span>
                    </span>
                    <span className={`font-coiny text-sm ${RoomStatusColor[room?.status as keyof typeof RoomStatusColor]}`}>
                      {RoomStatus[room?.status as keyof typeof RoomStatus]}
                    </span>
                    <span className={`font-coiny text-xs`}>
                      Ngày tạo: {dayjs(room.createdAt).format("DD/MM/YYYY HH:mm")}
                    </span>
                    <div>
                    </div>
                    <Tooltip id="join-room-code" />
                  </div>
                  <div className="flex gap-1 items-center">
                    {
                      room?.status === ERoomStatus.Scheduled && (
                        <>
                          <div>
                            <Button
                              onClick={() => setOpenModalUpdateGameTimer(true)}
                              className="!bg-transparent !p-1 !min-w-0 !shadow-none !rounded-none hover:!translate-x-0 hover:!translate-y-0 hover:!shadow-none active:!shadow-none"
                            >
                              <img src="/icons/reload.png" alt="Timer" className="min-w-7 w-7 h-7" />
                            </Button>
                            {openModalUpdateGameTimer && (
                              <ModalGameTimer
                                isOpen={openModalUpdateGameTimer}
                                roomId={room.id}
                                onClose={() => setOpenModalUpdateGameTimer(false)}
                                title="Thay đổi thời gian chơi"
                                onConfirm={handleUpdateTimer}>
                              </ModalGameTimer>
                            )}
                          </div>
                          <div>
                            <Button
                              onClick={() => (setOpenModalConfirm(true))}
                              className="!bg-transparent !p-1 !min-w-0 !shadow-none !rounded-none hover:!translate-x-0 hover:!translate-y-0 hover:!shadow-none active:!shadow-none"
                            >
                              <img src="/icons/remove.png" alt="Remove" className="min-w-7 w-7 h-7" />
                            </Button>
                            {
                              openModalConfirm && (
                                <ModalConfirm
                                  modalData={room.id}
                                  isOpen={openModalConfirm}
                                  onClose={() => setOpenModalConfirm(false)}
                                  title="Xác nhận hủy đặt lịch"
                                  onConfirm={handleCancelSchedule}>
                                </ModalConfirm>

                              )
                            }
                          </div>
                        </>
                      )
                    }
                    {
                      room?.status === ERoomStatus.Waiting && (
                        <>
                          <div>
                            <Button
                              onClick={() => (setOpenModalConfirm(true))}
                              className="!bg-transparent !p-1 !min-w-0 !shadow-none !rounded-none hover:!translate-x-0 hover:!translate-y-0 hover:!shadow-none active:!shadow-none"
                            >
                              <img src="/icons/remove.png" alt="Remove" className="min-w-7 w-7 h-7" />
                            </Button>
                            {
                              openModalConfirm && (
                                <ModalConfirm
                                  modalData={room.id}
                                  isOpen={openModalConfirm}
                                  onClose={() => setOpenModalConfirm(false)}
                                  title="Xác nhận hủy đặt lịch"
                                  onConfirm={handleCancelSchedule}>
                                </ModalConfirm>

                              )
                            }
                          </div>
                        </>
                      )
                    }
                    {
                      room?.status === ERoomStatus.Finished && (
                        <Button
                          className="!bg-transparent !p-1 !min-w-0 !shadow-none !rounded-none hover:!translate-x-0 hover:!translate-y-0 hover:!shadow-none active:!shadow-none"
                        >
                          <img src="/icons/history.png" alt="Remove" className="min-w-7 w-7 h-7" />
                        </Button>
                      )
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      }
    </div>
  );
};
export default GameInfoBox;
