import LoadingOverlay from "@/components/LoadingOverlay";
import ModalConfirm from "@/components/Modal/ModalConfirm";
import { EQuestionTypes } from "@/constants/QuestionTypes";
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

  const handleSendAnswer = (questionId: string) => {
    if (!socket || !roomId || !questionId) return;

    const { isSubmitAnswer, isOwner, isEndGame, isWaitingEndGame, textAnswer, currentQuestion, multipleChoiceSelectedAnswers } = roomState;

    if (isSubmitAnswer || isOwner || isEndGame || isWaitingEndGame) return;

    if (
      (!textAnswer?.trim() && currentQuestion?.mode === EQuestionTypes.TEXT) ||
      (currentQuestion?.mode !== EQuestionTypes.TEXT && !multipleChoiceSelectedAnswers?.length)
    ) {
      toast.warning("Bạn chưa nhập hoặc chọn đáp án cho câu hỏi này!");
      return;
    }

    roomDispatch(RoomActions.changeSelectedAnswers(multipleChoiceSelectedAnswers as number[]));

    const emitData: ISendAnswerDTO = {
      roomId,
      questionId,
      answerIndex: multipleChoiceSelectedAnswers?.[0] as number,
      answerIndexes: multipleChoiceSelectedAnswers,
      answerText: textAnswer ?? "",
    };

    socket.emit(SocketEvents.EMIT.ClientEmitSubmitQuestion, emitData);
  };

  const handleConfirmFinishGame = () => {
    if (!socket || !roomState.isOwner) {
      toast.warning("Chỉ chủ phòng mới có thể kết thúc trò chơi");
      return;
    }

    socket.emit(SocketEvents.EMIT.OwnerFinishGame, roomId);
    roomDispatch(RoomActions.changeOpenModalConfirmEndGame(false));
  };

  const handleCloseModalConfirmEndGame = () => {
    roomDispatch(RoomActions.changeOpenModalConfirmEndGame(false));
  };

  return (
    <div className="relative max-w-[1200px] w-full h-full p-2">
      {/* Scrollable main layout */}
      <div
        className={`
          fadeIn h-[calc(100%-40px)] mt-5 bg-[#ba85ff8f] shadow-xl rounded-[40px] overflow-y-auto
          [&::-webkit-scrollbar]:w-[3px]
          [&::-webkit-scrollbar-thumb]:bg-transparent
          [&::-webkit-scrollbar-thumb]:rounded-lg
          [&::-webkit-scrollbar-track]:bg-transparent
        `}
      >
        {!roomState.isWaiting && !roomState.isEndGame && (
          <div className="flex flex-col lg:flex-row w-full h-full gap-4">
            <div className="w-full lg:w-2/5">
              <InfoBox />
            </div>
            <div className="w-full lg:w-3/5">
              <QuestionBox
                isShowAnswer={roomState.isShowAnswer}
                correctAnswerText={roomState.correctTextAnswer}
                correctAnswers={roomState.correctAnswerOfCurrentQuestions}
                selectedAnswers={roomState.selectedAnswers}
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
      {roomState.isEndAnQuestion && roomState.isOwner && !roomState.isEndGame && (
        <ShowResult />
      )}
      {roomState.isEndGame && <EndGame />}
      <ModalConfirm
        isOpen={roomState.openMdoalConfirmEndGame}
        onClose={handleCloseModalConfirmEndGame}
        title={
          <span>
            Bạn có chắc chắn <br /> muốn kết thúc game ngay không?
          </span>
        }
        onConfirm={handleConfirmFinishGame}
      />
    </div>
  );
};

export default QuizzPage;
