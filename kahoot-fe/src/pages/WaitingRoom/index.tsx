import { RoomContext } from "@/providers/ContextProvider/RoomProvider";
import roomServices from "@/services/roomServices";
import RoomActions from "@/stores/roomStore/roomAction";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import PlayerItem from "./components/PlayerItem";

const WaitingRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { roomState, roomDispatch } = useContext(RoomContext);
  useEffect(() => {
    if (!roomId) return;
    const getRoomById = async () => {
      // Call the API to get the room by ID
      try {
        const response = await roomServices.getRoomById(roomId);
        if (response.statusCode !== 200) {
          console.log("error", response);
          return;
        }
        console.log("response", response);
        // Do something with the room data
        roomDispatch(RoomActions.changeCurrentRoom(response.data));
      } catch (error) {
        console.log("error", error);
      }
    };
    getRoomById();
  }, [roomDispatch, roomId]);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomState.currentRoom?.code ?? "");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };
  const handleOutGame = () => {};
  return (
    <div className='w-full h-screen'>
      <div className='font-diablo h-[140px] flex items-center justify-center flex-col w-full relative'>
        {/* Button out game */}
        <div
          onClick={handleOutGame}
          className='w-[60px] h-[60px] flex justify-center items-center cursor-pointer absolute top-2 left-2 hover:scale-[0.98] transition-all active:scale-[1.0]'
        >
          <img src='/buttons/SmallButton-pressed.png' />
          <img className='w-[30px] absolute top-[12px] left-[12px]' src='/icons/ExitIcon.png' />
        </div>

        {/* Game PIN */}
        <div className='mt-2 bg-white rounded-lg p-2 shadow-xl text-gray-700 flex flex-col justify-center items-center w-full max-w-[300px]'>
          <span className='inline-block h-[25px]'>Game PIN</span>
          <div className='flex justify-center h-[60px] max-w-[250px] w-full items-center'>
            {/* <span className='flex items-center justify-center bg-gray-400 h-[50px] w-full -rotate-2 rounded-lg'>
              Loading Game Pin...
            </span> */}
            <span
              onClick={handleCopy}
              className='text-4xl hover:bg-gray-300 rounded-md cursor-pointer px-2 py-1 active:bg-gray-200 transition-all'
            >
              {roomState.currentRoom?.code}
            </span>
          </div>
          <div className='h-[35px] flex justify-between items-center w-full mt-1'>
            <div className='flex items-center gap-2 text-xl w-[100px] bg-[#cccccca6] h-[35px] px-1 rounded-md'>
              <img className='w-5' src='/icons/icon-user-1.png' />
              <span>10</span>
            </div>
            <div className='flex items-center gap-3 w-[100px] h-[35px] px-1 rounded-md justify-center bg-[#cccccca6]'>
              <img className='w-5 cursor-pointer' src='/icons/speaker.png' />
              <img className='w-5 cursor-pointer' src='/icons/settings.png' />
              <img className='w-5 cursor-pointer' src='/icons/zoom-in.png' />
            </div>
          </div>
        </div>

        {/* Start game */}
        <div
          onClick={handleOutGame}
          className='w-[60px] h-[60px] flex justify-center items-center cursor-pointer absolute top-2 right-2 hover:scale-[0.98] transition-all active:scale-[1.0]'
        >
          <img src='/buttons/SmallButton.png' />
          <img className='w-[25px] absolute top-[12px] left-[20px]' src='/icons/PlayIcon.png' />
        </div>
      </div>
      <div className='flex justify-center items-center w-full h-[calc(100%-140px)] p-2 '>
        <div className='w-full max-w-[1200px] bg-[#ba85ff8f] rounded-xl h-full p-4 flex justify-around items-center flex-wrap gap-4 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent'>
          {/* <span className='font-diablo text-xl'>Chờ người chơi tham gia!</span> */}
          {roomState.listMemberOfRoom && roomState.listMemberOfRoom?.length > 0 ? (
            roomState.listMemberOfRoom?.map((player, index) => <PlayerItem player={player} key={index} />)
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
};
export default WaitingRoom;
