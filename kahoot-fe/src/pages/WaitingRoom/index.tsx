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
        // Do something with the room data
        roomDispatch(RoomActions.changeCurrentRoom(response.data));
      } catch (error) {
        console.log("error", error);
      }
    };
    getRoomById();
  }, [roomDispatch, roomId]);
  return (
    <div className='w-full h-screen'>
      <div className='font-diablo h-[140px] flex items-center justify-center flex-col w-full'>
        <div className='mt-2 bg-white rounded-lg p-4 shadow-xl text-gray-700 flex flex-col justify-center items-center w-full max-w-[350px]'>
          <span className='inline-block h-[30px]'>Game PIN</span>
          <div className='flex justify-center h-[60px] max-w-[250px] w-full items-center'>
            {/* <span className='flex items-center justify-center bg-gray-400 h-[50px] w-full -rotate-2 rounded-lg'>
              Loading Game Pin...
            </span> */}
            <span className='text-6xl hover:bg-gray-300 rounded-md cursor-pointer p-2 active:bg-gray-200 transition-all'>
              {roomState.currentRoom?.code}
            </span>
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center w-full h-[calc(100%-140px)] p-2 '>
        <div className='w-full max-w-[1200px] bg-[#ba85ff8f] rounded-xl h-full p-4 flex justify-around items-center flex-wrap gap-4 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent'>
          {/* <span className='font-diablo text-xl'>Chờ người chơi tham gia!</span> */}
          {Array.from({ length: 20 }).map((_, index) => (
            <PlayerItem key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default WaitingRoom;
