import { AuthContext } from "@/providers/ContextProvider/AuthProvider";
import { RoomContext } from "@/providers/ContextProvider/RoomProvider";
import { useContext, useEffect, useState } from "react";
import TimeCountdown from "./TimeCountdown";
import UserBox from "./UserBox";

const InfoBox = () => {
  const [time, setTime] = useState(30);
  const [key, setKey] = useState(0);
  const { authState } = useContext(AuthContext);
  const { roomState } = useContext(RoomContext);

  useEffect(() => {
    if (!roomState.currentQuestion?.id) return;
    setTime(roomState.currentQuestion.time);
    setKey((prev) => prev + 1);
  }, [roomState.currentQuestion?.id]);

  return (
    <div className='p-4'>
      <UserBox user={authState.currentUser} />
      <div className='mt-4 min-h-[200px] bg-[#919a9070] w-full rounded-xl flex flex-col items-center  p-2 select-none cursor-pointer'>
        <TimeCountdown key={`time-${key}`} timeLeft={time} />
        <div className='w-full flex justify-between items-center font-diablo'>
          <div className='flex items-center justify-center gap-1 flex-col w-[150px]'>
            <img className='w-[100px] h-[100px]' src='/icons/icon-mouse.png' />
            <span className='text-sm'>Đang chơi</span>
            <span className='text-xl'>50</span>
          </div>
          <div className='flex items-center justify-center gap-1 flex-col w-[150px]'>
            <img className='w-[100px] h-[100px]' src='/icons/icon-cat-1.png' />
            <span className='text-sm'>Đã trả lời</span>
            <span className='text-xl'>10</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InfoBox;
