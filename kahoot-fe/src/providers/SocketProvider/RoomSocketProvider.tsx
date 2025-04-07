import { EQuestionTypes } from "@/constants/QuestionTypes";
import SocketEvents from "@/constants/SocketEvents";
import { ICurrentUser } from "@/interfaces/authTypes";
import { IQuestionGame } from "@/interfaces/questionTypes";
import { IGetCurrentQuestionResponse, IJoinRoomResponse, IUserPoint } from "@/interfaces/roomTypes";
import { ROUTES } from "@/routes/routePath";
import AppActions from "@/stores/appStore/appAction";
import GameActions from "@/stores/gameStore/gameAction";
import RoomActions from "@/stores/roomStore/roomAction";
import { MezonWebViewEvent } from "@/types/webview";
import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSocket } from ".";
import { AppContext } from "../ContextProvider/AppProvider";
import { GameContext } from "../ContextProvider/GameProvider";
import { RoomContext } from "../ContextProvider/RoomProvider";

const RoomSocketProvider: React.FC = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const { roomDispatch } = useContext(RoomContext);
  const { appDispatch } = useContext(AppContext);
  const { gameDispatch } = useContext(GameContext);
  useEffect(() => {
    if (!socket) return;
    socket.on(SocketEvents.ON.UserJoinedRoom, (data: IJoinRoomResponse) => {
      const { roomId, members, isOwner, gameId } = data;
      roomDispatch(RoomActions.changeListMemberOfRoom(members));
      roomDispatch(RoomActions.changeIsOwner(isOwner));
      gameDispatch(GameActions.changeCurrentGameId(gameId));
      navigate(ROUTES.WAITING_ROOM.replace(":roomId", roomId));
      window.Mezon.WebView?.postEvent(
        "JOIN_ROOM" as MezonWebViewEvent,
        {
          roomId: data.roomId,
        },
        () => {}
      );
    });

    socket.on(SocketEvents.ON.ServerEmitUserJoinRoom, (data: ICurrentUser) => {
      roomDispatch(RoomActions.userJoinRoom(data));
    });

    socket.on(SocketEvents.ON.UserLeftRoom, (data) => {
      window.Mezon.WebView?.postEvent(
        "LEAVE_ROOM" as MezonWebViewEvent,
        {
          roomId: data?.roomId,
        },
        () => {}
      );
    });

    socket.on(SocketEvents.ON.ServerEmitLeaveRoom, (data: ICurrentUser) => {
      roomDispatch(RoomActions.userLeaveRoom(data));
    });

    socket.on(SocketEvents.ON.ServerEmitCurrentQuestion, (data: IGetCurrentQuestionResponse) => {
      roomDispatch(RoomActions.changeCurrentQuestion(data.currentQuestion));
      roomDispatch(RoomActions.changeIsWaiting(false));
      roomDispatch(RoomActions.changeIsReconnecting(false));
      roomDispatch(RoomActions.changeIsEndAnQuestion(false));
      roomDispatch(RoomActions.changeIsSubmitAnswer(false));
      roomDispatch(RoomActions.changeCorrectAnswersOfCurrentQuestion([]));
      roomDispatch(RoomActions.changeListQuestionAnalysis({ totalOptions: 0, listQuestionAnalysis: [] }));

      if (data.submitedAnswer) {
        roomDispatch(RoomActions.changeSelectedAnswers([data.submitedAnswer.answerIndex]));
        roomDispatch(RoomActions.changeIsSubmitAnswer(true));
      }
      const lastTotalPoint = data?.lastTotalPoint;
      if (lastTotalPoint !== undefined) {
        roomDispatch(RoomActions.changeTotalPoint(lastTotalPoint));
      }
    });

    socket.on(SocketEvents.ON.ServerEmitGameStarted, (data) => {
      roomDispatch(RoomActions.changeIsWaiting(true));
      roomDispatch(RoomActions.changeIsEndAnQuestion(false));
      roomDispatch(RoomActions.changeIsSubmitAnswer(false));
      roomDispatch(RoomActions.changeCorrectAnswersOfCurrentQuestion([]));
      roomDispatch(RoomActions.changeListQuestionAnalysis({ totalOptions: 0, listQuestionAnalysis: [] }));
      roomDispatch(RoomActions.changeSubmitedUser(0));
      roomDispatch(RoomActions.changeSelectedAnswers([]));
      roomDispatch(RoomActions.changeUserPoint(undefined));
      roomDispatch(RoomActions.changeUserRanking([]));
      roomDispatch(RoomActions.changeCurrentQuestion(undefined));
      roomDispatch(RoomActions.changeIsEndGame(false));
      roomDispatch(RoomActions.changeIsWaitingEndGame(false));
      roomDispatch(RoomActions.changeOpenModalConfirmEndGame(false));

      navigate(ROUTES.QUIZZ.replace(":roomId", data.roomId));
    });

    socket.on(SocketEvents.ON.ServerEmitQuestion, (data: { question: IQuestionGame; questionNumber: number }) => {
      console.log("Server emit question", data);
      roomDispatch(RoomActions.changeIsWaiting(false));
      roomDispatch(RoomActions.changeIsEndAnQuestion(false));
      roomDispatch(RoomActions.changeIsSubmitAnswer(false));
      roomDispatch(RoomActions.changeIsReconnecting(false));
      roomDispatch(RoomActions.changeCorrectAnswersOfCurrentQuestion([]));
      roomDispatch(RoomActions.changeListQuestionAnalysis({ totalOptions: 0, listQuestionAnalysis: [] }));
      roomDispatch(RoomActions.changeSubmitedUser(0));
      roomDispatch(RoomActions.changeSelectedAnswers([]));
      roomDispatch(RoomActions.changeCurrentQuestionPoint(0));

      const currentQuestion: IQuestionGame = {
        ...data.question,
        order: data?.questionNumber,
      };
      roomDispatch(RoomActions.changeCurrentQuestion(currentQuestion));
    });

    socket.on(SocketEvents.ON.ServerEmitCorrectAnswer, (data) => {
      console.log("Server emit correct answer", data);
      /*{
        questionMode,
        totalOptions,
        questionAnalysis,
        correctIndex,
        questionId,
        correctIndexes,
        correctText,
      }*/
      if (data?.questionMode === EQuestionTypes.SINGLE_CHOICE) {
        roomDispatch(RoomActions.changeCorrectAnswersOfCurrentQuestion([data?.correctIndex]));
      } else if (data?.questionMode === EQuestionTypes.MULTIPLE_CHOICE) {
        roomDispatch(RoomActions.changeCorrectAnswersOfCurrentQuestion([...((data?.correctIndexes as number[]) ?? [])]));
      } else if (data?.questionMode === EQuestionTypes.TEXT) {
        roomDispatch(RoomActions.changeCorrectTextAnswer(data?.correctText));
      }
      roomDispatch(
        RoomActions.changeListQuestionAnalysis({
          totalOptions: data?.totalOptions,
          listQuestionAnalysis: data?.questionAnalysis,
        })
      );
    });

    socket.on(SocketEvents.ON.ServerEmitWaitNextQuestion, (data) => {
      roomDispatch(RoomActions.changeIsEndAnQuestion(true));
      const lastTotalPoint = data?.lastTotalPoint;
      if (lastTotalPoint !== undefined) {
        roomDispatch(RoomActions.changeTotalPoint(lastTotalPoint));
      }
    });

    socket.on(SocketEvents.ON.ServerEmitUserRanking, (data) => {
      roomDispatch(RoomActions.changeUserRanking(data?.userRanking));
    });

    socket.on(SocketEvents.ON.ServerEmitUserSubmited, (data) => {
      console.log("Server emit user submited", data);
      roomDispatch(RoomActions.changeIsSubmitAnswer(true));
    });

    socket.on(SocketEvents.ON.ServerEmitNewUserSubmited, (data) => {
      roomDispatch(RoomActions.changeSubmitedUser(data.submitedUser));
      console.log("Server emit new user submited", data);
    });

    socket.on(SocketEvents.ON.ServerEmitQuestionFinished, (data: IUserPoint) => {
      roomDispatch(RoomActions.changeUserPoint(data));
      if (data?.isCorrect) {
        appDispatch(AppActions.changeIsPlayCorrectSound(true));
      } else {
        appDispatch(AppActions.changeIsPlayErrorSound(true));
      }
      console.log("Server emit question finished", data);
    });

    socket.on(SocketEvents.ON.ServerEmitGameFinished, (data) => {
      console.log("Server emit game finished", data);
      roomDispatch(RoomActions.changeIsEndGame(true));
      roomDispatch(RoomActions.changeOpenModalConfirmEndGame(false));
      // roomDispatch(RoomActions.changeIsWaitingEndGame(false));
      roomDispatch(RoomActions.changeUserRanking(data?.userRanking));
      roomDispatch(RoomActions.changeTotalQuestion(data?.totalQuestions ?? 1));
    });

    socket.on(SocketEvents.ON.ServerEmitWaitGameFinished, (data) => {
      console.log("Server emit wait game finished", data);
      roomDispatch(RoomActions.changeIsWaitingEndGame(true));
      roomDispatch(RoomActions.changeIsEndAnQuestion(true));
      roomDispatch(RoomActions.changeIsSubmitAnswer(true));
    });

    return () => {
      socket.off(SocketEvents.ON.ServerEmitUserJoinRoom);
      socket.off(SocketEvents.ON.ServerEmitLeaveRoom);
      socket.off(SocketEvents.ON.UserJoinedRoom);
      socket.off(SocketEvents.ON.ServerEmitGameStarted);
      socket.off(SocketEvents.ON.ServerEmitQuestion);
      socket.off(SocketEvents.ON.ServerEmitCorrectAnswer);
      socket.off(SocketEvents.ON.ServerEmitWaitNextQuestion);
      socket.off(SocketEvents.ON.ServerEmitUserRanking);
      socket.off(SocketEvents.ON.ServerEmitGameFinished);
      socket.off(SocketEvents.ON.ServerEmitWaitGameFinished);
      socket.off(SocketEvents.ON.ServerEmitUserSubmited);
      socket.off(SocketEvents.ON.ServerEmitNewUserSubmited);
      socket.off(SocketEvents.ON.ServerEmitQuestionFinished);
    };
  }, [roomDispatch, navigate, socket]);
  return <Outlet />;
};
export default RoomSocketProvider;
