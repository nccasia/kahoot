import { AuthContext } from "@/providers/ContextProvider/AuthProvider";
import { RoomContext } from "@/providers/ContextProvider/RoomProvider";
import { ROUTES } from "@/routes/routePath";
import RoomActions from "@/stores/roomStore/roomAction";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ChangeQuestionBox from "../ChangeQuestion";
import TimeCountdown from "./TimeCountdown";
import UserBox from "./UserBox";

const InfoBox = () => {
  const [time, setTime] = useState(30);
  const [key, setKey] = useState(0);
  const { authState } = useContext(AuthContext);
  const { roomState, roomDispatch } = useContext(RoomContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!roomState.currentQuestion?.id) return;
    setTime(roomState.currentQuestion?.time ?? 30);

    setKey((prev) => prev + 1);
  }, [roomState.currentQuestion?.time, roomState.currentQuestion?.id]);

  const handleFinishGame = () => {
    roomDispatch(RoomActions.changeOpenModalConfirmEndGame(true));
  };

  const { gameId } = useParams<string>();
  const handleBackToGameDetail = () => {
    if (!gameId) return;
    navigate(ROUTES.GAME_DETAIL.replace(":gameId", gameId));
  };

  return (
    <div className='p-2 md:p-4 flex flex-col md:flex-col'>
      <div className='flex justify-between gap-2'>
        <div
          onClick={handleBackToGameDetail}
          className='flex-1 max-w-[230px] h-[50px] bg-[#c92931] shadow-lg rounded-md flex items-center justify-center hover:brightness-90 active:brightness-100 transition-all cursor-pointer'
        >
          <span className='font-coiny text-lg'>Thoát</span>
        </div>
        <ChangeQuestionBox />
      </div>
      <UserBox
        isOwner={false}
        onFinishGame={handleFinishGame}
        onPauseGame={() => {}}
        score={roomState.userPoint?.totalPoint ?? 0}
        user={authState.currentUser}
      />
      <div className='hidden mt-4 min-h-[200px] md:max-w-[350px] bg-[#919a9070] w-full rounded-xl md:flex flex-col items-center  p-2 select-none cursor-pointer'>
        <div className='min-h-[100px] flex items-center justify-center w-full'>
          {roomState.isEndAnQuestion ? (
            <div
              className='h-full flex justify-center items-center text-white font-coiny text-5xl animate-pulse'
              style={{ animationDuration: ".5s" }}
            >
              <span>+{roomState.userPoint?.currentQuestionPoint ?? 0}</span>
            </div>
          ) : (
            <TimeCountdown key={`time-${key}`} timeLeft={time} />
          )}
        </div>
        <div className='font-coiny text-white'>
          <div className='text-lg'>
            <h5>Bạn đang xem trước game</h5>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InfoBox;
