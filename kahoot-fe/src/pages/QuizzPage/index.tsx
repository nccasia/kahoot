import LoadingOverlay from "@/components/LoadingOverlay";
import ModalConfirm from "@/components/Modal/ModalConfirm";
import SocketEvents from "@/constants/SocketEvents";
import { ISendAnswerDTO } from "@/interfaces/questionTypes";
import { RoomContext } from "@/providers/ContextProvider/RoomProvider";
import { useSocket } from "@/providers/SocketProvider";
import RoomActions from "@/stores/roomStore/roomAction";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import EndGame from "./components/EndGame";
import InfoBox from "./components/InfoBox";
import QuestionBox from "./components/QuestionBox";
import ShowResult from "./components/ShowResult";

const QuizzPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { roomState, roomDispatch } = useContext(RoomContext);

  const socket = useSocket();
  const handleSendAnswer = (questionId: string, answerIndex: number) => {
    if (!socket || !roomId) return;
    if (!questionId) return;
    if (roomState.isSubmitAnswer || roomState.isOwner || roomState.isEndGame || roomState.isWaitingEndGame) return;

    roomDispatch(RoomActions.changeSelectedAnswer(answerIndex));
    const emitData: ISendAnswerDTO = {
      roomId,
      answerIndex: answerIndex,
      questionId,
    };
    socket.emit(SocketEvents.EMIT.ClientEmitSubmitQuestion, emitData);
  };
  const handleConfirmFinishGame = async () => {
    // Finish game
    if (!socket) return;
    if (!roomState.isOwner) {
      toast.warning("Chỉ chủ phòng mới có thể kết thúc trò chơi");
      return;
    }
    socket.emit(SocketEvents.EMIT.OwnerFinishGame, roomId);
  };
  const handleCloseModalConfirmEndGame = () => {
    roomDispatch(RoomActions.changeOpenModalConfirmEndGame(false));
  };
  return (
    <div className='max-w-[1200px] w-[100%] h-full p-2'>
      <div
        style={{ animationDelay: "unset" }}
        className='fadeIn h-[calc(100%-40px)] mt-[20px] bg-[#ba85ff8f] shadow-xl rounded-[40px] overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent'
      >
        {!roomState.isWaiting && !roomState.isEndGame && (
          <div className='flex w-full h-full'>
            <div className='w-2/5'>
              <InfoBox />
            </div>
            <div className='w-3/5'>
              <QuestionBox
                correctAnswer={roomState.correctAnswerOfCurrentQuestion}
                selectedAnswer={roomState.selectedAnswer}
                isOwner={roomState.isOwner}
                isSubmitAnswer={roomState.isSubmitAnswer}
                onSendAnswer={handleSendAnswer}
                question={roomState.currentQuestion}
              />
            </div>
          </div>
        )}
      </div>
      {roomState.isWaiting && (
        <LoadingOverlay
          title={
            <span>
              Trò chơi chuẩn bị bắt đầu <br /> sẵn sàng chiến đấu nào!
            </span>
          }
        />
      )}
      {roomState.isReconecting && (
        <LoadingOverlay
          title={
            <span>
              Đang kết nối lại với trò chơi <br /> vui lòng đợi trong giây lát!
            </span>
          }
        />
      )}
      {roomState.isEndAnQuestion && roomState.isOwner && <ShowResult />}
      {roomState.isEndGame && <EndGame />}
      <ModalConfirm
        isOpen={roomState.openMdoalConfirmEndGame}
        onClose={handleCloseModalConfirmEndGame}
        title={
          <span>
            Bạn có chắc chắn <br /> muốn kết thúc game bây giờ không?
          </span>
        }
        onConfirm={handleConfirmFinishGame}
      />
    </div>
  );
};
export default QuizzPage;
