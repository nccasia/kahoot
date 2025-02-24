import SocketEvents from "@/constants/SocketEvents";
import { ICurrentUser } from "@/interfaces/authTypes";
import { IQuestionGame } from "@/interfaces/questionTypes";
import { IJoinRoomResponse } from "@/interfaces/roomTypes";
import { ROUTES } from "@/routes/routePath";
import RoomActions from "@/stores/roomStore/roomAction";
import { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSocket } from ".";
import { RoomContext } from "../ContextProvider/RoomProvider";

const RoomSocketProvider: React.FC = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const { roomDispatch } = useContext(RoomContext);
  useEffect(() => {
    if (!socket) return;
    socket.on(SocketEvents.ON.UserJoinedRoom, (data: IJoinRoomResponse) => {
      console.log("User joined room", data);
      const { roomId, members, isOwner } = data;
      roomDispatch(RoomActions.changeListMemberOfRoom(members));
      roomDispatch(RoomActions.changeIsOwner(isOwner));
      navigate(ROUTES.WAITING_ROOM.replace(":roomId", roomId));
    });

    socket.on(SocketEvents.ON.ServerEmitUserJoinRoom, (data: ICurrentUser) => {
      console.log("User joind room", data);
      roomDispatch(RoomActions.userJoinRoom(data));
    });

    socket.on(SocketEvents.ON.ServerEmitLeaveRoom, (data: ICurrentUser) => {
      console.log("User leave room", data);
      roomDispatch(RoomActions.userLeaveRoom(data));
    });

    socket.on(SocketEvents.ON.ServerEmitGameStarted, (data) => {
      roomDispatch(RoomActions.changeIsWaiting(true));
      console.log("Server emit game started", data);
      navigate(ROUTES.QUIZZ.replace(":roomId", data.roomId));
    });

    socket.on(SocketEvents.ON.ServerEmitQuestion, (data: { question: IQuestionGame }) => {
      console.log("Server emit question", data);
      roomDispatch(RoomActions.changeIsWaiting(false));
      roomDispatch(RoomActions.changeIsEndAnQuestion(false));
      roomDispatch(RoomActions.changeIsSubmitAnswer(false));
      roomDispatch(RoomActions.changeCurrentQuestion(data.question));
    });

    socket.on(SocketEvents.ON.ServerEmitCorrectAnswer, (data) => {
      console.log("Server emit correct answer", data);
    });

    socket.on(SocketEvents.ON.ServerEmitWaitNextQuestion, (data) => {
      console.log("Server emit wait next question", data);
      roomDispatch(RoomActions.changeIsEndAnQuestion(true));
    });

    socket.on(SocketEvents.ON.ServerEmitUserRanking, (data) => {
      console.log("Server emit user ranking", data);
    });

    socket.on(SocketEvents.ON.ServerEmitGameFinished, (data) => {
      console.log("Server emit game finished", data);
    });

    socket.on(SocketEvents.ON.ServerEmitWaitGameFinished, (data) => {
      console.log("Server emit wait game finished", data);
    });

    socket.on(SocketEvents.ON.ServerEmitUserSubmited, (data) => {
      console.log("Server emit user submited", data);
    });

    socket.on(SocketEvents.ON.ServerEmitNewUserSubmited, (data) => {
      console.log("Server emit new user submited", data);
      roomDispatch(RoomActions.changeIsSubmitAnswer(true));
    });

    socket.on(SocketEvents.ON.ServerEmitQuestionFinished, (data) => {
      console.log("Server emit question finished", data);
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
