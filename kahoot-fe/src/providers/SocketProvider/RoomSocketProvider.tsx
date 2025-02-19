import SocketEvents from "@/constants/SocketEvents";
import { ICurrentUser } from "@/interfaces/authTypes";
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
    socket.on(SocketEvents.ON.UserJoinedRoomd, (data: IJoinRoomResponse) => {
      const { roomId, members } = data;
      console.log("User joined room", data);
      roomDispatch(RoomActions.changeListMemberOfRoom(members));
      navigate(ROUTES.WAITING_ROOM.replace(":roomId", roomId));
    });

    socket.on(SocketEvents.ON.ServerEmitUserJoinRoomd, (data: ICurrentUser) => {
      console.log("User join room", data);
      roomDispatch(RoomActions.userJoinRoom(data));
    });

    socket.on(SocketEvents.ON.ServerEmitLeaveRoomd, (data: ICurrentUser) => {
      console.log("User leave room", data);
      roomDispatch(RoomActions.userLeaveRoom(data));
    });

    return () => {
      socket.off(SocketEvents.ON.ServerEmitUserJoinRoomd);
      socket.off(SocketEvents.ON.ServerEmitLeaveRoomd);
      socket.off(SocketEvents.ON.UserJoinedRoomd);
    };
  }, [roomDispatch, navigate, socket]);
  return <Outlet />;
};
export default RoomSocketProvider;
