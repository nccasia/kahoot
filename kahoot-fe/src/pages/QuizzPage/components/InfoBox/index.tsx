import { AuthContext } from "@/providers/ContextProvider/AuthProvider";
import { RoomContext } from "@/providers/ContextProvider/RoomProvider";
import randomResultAnswerText from "@/utils/functions/getAnswerText";
import { useContext, useEffect, useMemo, useState } from "react";
import TimeCountdown from "./TimeCountdown";
import UserBox from "./UserBox";

const InfoBox = () => {
  const [time, setTime] = useState(30);
  const [key, setKey] = useState(0);
  const { authState } = useContext(AuthContext);
  const { roomState } = useContext(RoomContext);

  useEffect(() => {
    if (!roomState.currentQuestion?.id) return;
    const endTime = new Date(roomState.currentQuestion.endTime);
    const currentTime = new Date();

    console.log("endTime", endTime);
    console.log("currentTime", currentTime);
    const timeRemaining = endTime.getTime() - currentTime.getTime();

    // Chuyển đổi sang giây
    const secondsRemaining = Math.max(0, Math.ceil(timeRemaining / 1000));
    setTime(secondsRemaining);

    setKey((prev) => prev + 1);
  }, [roomState.currentQuestion?.id]);

  const congratulationText = useMemo(() => {
    return randomResultAnswerText("congratulation");
  }, [roomState.currentQuestion?.id]);
  //roomState.currentQuestion?.id, roomState.isOwner, roomState.isEndAnQuestion, roomState.selectedAnswer, randomResultAnswerText
  const errorText = useMemo(() => {
    return randomResultAnswerText("error");
  }, [roomState.currentQuestion?.id]);
  const correctText = useMemo(() => {
    return randomResultAnswerText("correct");
  }, [roomState.currentQuestion?.id]);
  const wrongText = useMemo(() => {
    return randomResultAnswerText("wrong");
  }, [roomState.currentQuestion?.id]);
  const waitingText = useMemo(() => {
    return randomResultAnswerText("waiting");
  }, [roomState.currentQuestion?.id]);
  const startText = useMemo(() => {
    return randomResultAnswerText("start");
  }, [roomState.currentQuestion?.id]);

  return (
    <div className='p-4'>
      <UserBox score={roomState.userPoint?.totalPoint ?? 0} user={authState.currentUser} />
      <div className='mt-4 min-h-[200px] bg-[#919a9070] w-full rounded-xl flex flex-col items-center  p-2 select-none cursor-pointer'>
        <div className='min-h-[100px] flex items-center justify-center w-full'>
          {roomState.isEndAnQuestion ? (
            <div
              className='h-full flex justify-center items-center text-white font-diablo text-5xl animate-pulse'
              style={{ animationDuration: ".5s" }}
            >
              <span>+{roomState.userPoint?.currentQuestionPoint ?? 0}</span>
            </div>
          ) : (
            <TimeCountdown key={`time-${key}`} timeLeft={time} />
          )}
        </div>
        {roomState.isOwner ? (
          <div className='w-full flex justify-between items-center font-diablo'>
            <div className='flex items-center justify-center gap-1 flex-col w-[150px] text-white'>
              <img className='w-[100px] h-[100px]' src='/icons/icon-mouse.png' />
              <span className='text-sm'>Đang chơi</span>
              <span className='text-xl'>{roomState.listMemberOfRoom?.length}</span>
            </div>
            <div className='flex items-center justify-center gap-1 flex-col w-[150px] text-white'>
              <img className='w-[100px] h-[100px]' src='/icons/icon-cat-1.png' />
              <span className='text-sm'>Đã trả lời</span>
              <span className='text-xl'>{roomState.submitedUser}</span>
            </div>
          </div>
        ) : (
          <div className='font-diablo text-white'>
            {roomState.isEndAnQuestion ? (
              <>
                {roomState.correctAnswerOfCurrentQuestion === roomState.selectedAnswer ? (
                  <div className='text-sm'>
                    <h5>{congratulationText}</h5>
                    <h5>{correctText}</h5>
                  </div>
                ) : (
                  <div className='text-sm'>
                    <h5>{errorText}</h5>
                    <h5>{wrongText}</h5>
                  </div>
                )}
              </>
            ) : (
              <>
                {roomState.isSubmitAnswer ? (
                  <div className='text-sm'>
                    <h5>{waitingText}</h5>
                  </div>
                ) : (
                  <div className='text-sm'>
                    <h5>{startText}</h5>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default InfoBox;
