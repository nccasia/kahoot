import { CopyTypes } from "@/constants/CopyTypes";
import ENV from "@/constants/Environment";
import SocketEvents from "@/constants/SocketEvents";
import { AppContext } from "@/providers/ContextProvider/AppProvider";
import { RoomContext } from "@/providers/ContextProvider/RoomProvider";
import { useSocket } from "@/providers/SocketProvider";
import { ROUTES } from "@/routes/routePath";
import roomServices from "@/services/roomServices";
import RoomActions from "@/stores/roomStore/roomAction";
import { QRCodeSVG } from 'qrcode.react';
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tooltip } from 'react-tooltip';
import PlayerItem from "./components/PlayerItem";

const WaitingRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { roomState, roomDispatch } = useContext(RoomContext);
  const {appState} = useContext(AppContext);
  const [copyRoomCodeText, setCopyRoomCodeText] = useState<string>("Sao chép mã phòng");
  const [copyLinkText, setCopyLinhText] = useState<string>("Sao chép liên kết");
  const navigate = useNavigate();
  const socket = useSocket();
  useEffect(() => {
    if (!roomId) return;
    const getRoomById = async () => {
      // Call the API to get the room by ID
      try {
        const response = await roomServices.getRoomById(roomId);
        if (response.statusCode !== 200) {
          return;
        }
        // Do something with the room data
        roomDispatch(RoomActions.changeCurrentRoom(response.data));
      } catch (error) {
        console.log("error", error);
      }
    };
    getRoomById();
  }, [roomDispatch, roomId]);
  const handleCopy = async (type: CopyTypes) => {
    switch (type) {
      case CopyTypes.Link:
        await navigator.clipboard.writeText(`${ENV.MEZON_URL}/channel-app/${appState?.currentChannel?.channelId}/${appState?.clanId}?code=${roomState.currentRoom?.code}`);
        setCopyLinhText("Đã sao chép liên kết");
        break;
      case CopyTypes.Code:
        await navigator.clipboard.writeText(roomState.currentRoom?.code ?? "");
        setCopyRoomCodeText("Đã sao chép mã phòng");
        break;
      default:
        break;
    }
  };
  const handleOutGame = () => {
    if (!socket) return;
    socket.emit(SocketEvents.EMIT.ClientEmitLeaveRoom, roomId);
    navigate(ROUTES.SEARCH_ROOM);
  };
  const handleStartGame = () => {
    if (!socket) return;
    if (!roomId) return;
    socket.emit(SocketEvents.EMIT.OwnerStartGame, roomId);
  };
  return (
    <div className='w-full h-screen'>
      <div className=' font-coiny h-[220px] md:h-[160px] flex items-center justify-end flex-col w-full relative'>
        {/* Button out game */}
        <div
          onClick={handleOutGame}
          className='w-[50px] h-[50px] flex justify-center items-center cursor-pointer absolute top-2 left-2 hover:scale-[0.98] transition-all active:scale-[1.0]'
        >
          <img src='/buttons/SmallButton-pressed.png' />
          <img className='w-[25px] absolute top-[10px] left-[10px]' src='/icons/ExitIcon.png' />
        </div>

        {/* Start game */}
        {roomState.isOwner && (
          <div
            onClick={handleStartGame}
            className='w-[50px] h-[50px] flex justify-center items-center cursor-pointer absolute top-2 right-2 hover:scale-[0.98] transition-all active:scale-[1.0]'
          >
            <img src='/buttons/SmallButton.png' />
            <img className='w-[20px] absolute top-[12px] left-[17px]' src='/icons/PlayIcon.png' />
          </div>
        )}

        {/* Game PIN */}
        <div className='bg-[#5d64d8c2] text-white rounded-lg p-2 shadow-xl flex flex-col justify-center items-center w-full mx-2 max-w-[400px]'>
          <div className="w-full flex justify-between items-center py-2">
            <div className='flex flex-col items-center justify-between gap-2 mt-1'>
              <span className='inline-block h-[25px] text-2xl'>GAME PIN</span>
              <div className='flex justify-center max-w-[200px] w-full items-center'>
                {!roomState.currentRoom?.code ? (
                  <span className='flex items-center justify-center bg-gray-400 w-full -rotate-2 rounded-lg'>
                    Loading Game Pin...
                  </span>
                ) : (
                  <span
                    onClick={() => {
                      handleCopy(CopyTypes.Code);
                    }}
                    onMouseLeave={() => {
                      setCopyRoomCodeText("Sao chép mã phòng");
                    }}
                    data-tooltip-id="copy-code-btn"
                    data-tooltip-content={copyRoomCodeText}
                    className='text-4xl hover:bg-gray-400 rounded-md cursor-pointer px-2 active:bg-gray-200 transition-all'
                  >
                    {roomState.currentRoom?.code}
                  </span>
                )}
                <Tooltip id="copy-code-btn" />
              </div>
            </div>
            <div
              data-tooltip-id="copy-link-btn"
              data-tooltip-content={copyLinkText}
              onClick={() => {
                handleCopy(CopyTypes.Link);
              }}
              onMouseLeave={() => {
                setCopyLinhText("Sao chép liên kết");
              }}
              className="p-1 cursor-pointer">
              <QRCodeSVG
                value={`${ENV.MEZON_URL}/channel-app/${appState?.currentChannel?.channelId}/${appState?.clanId}?code=${roomState.currentRoom?.code}`}
                fgColor="white"
                bgColor="transparent"
                size={80}
              />
              <Tooltip id="copy-link-btn" />
            </div>
          </div>
          <div className='h-[35px] flex justify-between items-center w-full mt-1'>
            <div className='flex items-center gap-2 text-xl w-[100px] bg-[#cccccca6] h-[35px] px-1 rounded-md'>
              <img className='w-5' src='/icons/icon-user-1.png' />
              <span className='text-gray-700'>{roomState.listMemberOfRoom?.length ?? 0}</span>
            </div>
            <div className='flex items-center gap-3 w-[100px] h-[35px] px-1 rounded-md justify-center bg-[#cccccca6]'>
              <img className='w-5 cursor-pointer' src='/icons/speaker.png' />
              <img className='w-5 cursor-pointer' src='/icons/settings.png' />
              <img className='w-5 cursor-pointer' src='/icons/zoom-in.png' />
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center w-full h-[calc(100%-220px)] md:h-[calc(100%-160px)] p-2'>
        <div className='w-full max-w-[1200px] bg-[#ba85ff8f] rounded-xl h-full p-2 flex justify-around items-center flex-wrap gap-4 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent'>
          {/* <span className='font-coiny text-xl'>Chờ người chơi tham gia!</span> */}
          {roomState.listMemberOfRoom && roomState.listMemberOfRoom?.length > 0 ? (
            roomState.listMemberOfRoom?.map((player, index) => <PlayerItem player={player} key={index} />)
          ) : (
            <div className='font-coiny text-2xl'>Chưa có người chơi nào tham gia</div>
          )}
        </div>
      </div>
    </div>
  );
};
export default WaitingRoom;
