import LoadingOverlay from "@/components/LoadingOverlay";
import SocketEvents from "@/constants/SocketEvents";
import { ISendAnswerDTO } from "@/interfaces/questionTypes";
import { RoomContext } from "@/providers/ContextProvider/RoomProvider";
import { useSocket } from "@/providers/SocketProvider";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import InfoBox from "./components/InfoBox";
import QuestionBox from "./components/QuestionBox";
import ShowResult from "./components/ShowResult";

const QuizzPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  console.log("roomId", roomId);
  const { roomState } = useContext(RoomContext);
  const socket = useSocket();
  const handleSendAnswer = (questionId: string, answerIndex: number) => {
    console.log(roomId, questionId, answerIndex);
    if (!socket || !roomId) return;
    if (!questionId) return;
    const emitData: ISendAnswerDTO = {
      roomId,
      answerIndex: answerIndex,
      questionId,
    };
    console.log("emitData", emitData);
    socket.emit(SocketEvents.EMIT.ClientEmitSubmitQuestion, emitData);
  };
  return (
    <div className='max-w-[1200px] w-[100%] h-full p-2'>
      <div
        style={{ animationDelay: "unset" }}
        className='fadeIn h-[calc(100%-40px)] mt-[20px] bg-[#ba85ff8f] shadow-xl rounded-[40px] overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent'
      >
        {!roomState.isWaiting && (
          <div className='flex w-full h-full'>
            <div className='w-2/5 border-r-2 border-white'>
              <InfoBox />
            </div>
            <div className='w-3/5'>
              <QuestionBox onSendAnswer={handleSendAnswer} question={roomState.currentQuestion} />
            </div>
          </div>
        )}
      </div>
      {roomState.isWaiting && <LoadingOverlay />}
      {roomState.isEndAnQuestion && <ShowResult />}
    </div>
  );
};
export default QuizzPage;
