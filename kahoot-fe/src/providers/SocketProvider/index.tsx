import ENV from "@/constants/Environment";
import SocketEvents from "@/constants/SocketEvents";
import { IJoinRoomResponse } from "@/interfaces/roomTypes";
import { ROUTES } from "@/routes/routePath";
import GameActions from "@/stores/gameStore/gameAction";
import RoomActions from "@/stores/roomStore/roomAction";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "../ContextProvider/AuthProvider";
import { GameContext } from "../ContextProvider/GameProvider";
import { RoomContext } from "../ContextProvider/RoomProvider";

const SocketContext = createContext<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = () => {
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const [socketInitialized, setSocketInitialized] = useState(false);
  const { authState } = useContext(AuthContext);
  const { roomDispatch } = useContext(RoomContext);
  const { gameDispatch } = useContext(GameContext);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("authState", authState);
    if (!socketInitialized && authState.currentUser?.userId) {
      socket.current = io(`${ENV.BACKEND_URL}/QUIZ`, {
        withCredentials: true,
        query: { userId: authState.currentUser.userId },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        extraHeaders: {
          Authorization: `Bearer ${authState.currentUser.accessToken}`,
        },
      });
      socket.current.on("connect", () => {
        console.log("Connected to socket");
      });
      socket.current.on(SocketEvents.ON.ClientError, (error) => {
        console.log("Socket error", error);
      });

      socket.current.on(SocketEvents.ON.UserReconnectedRoom, (data: IJoinRoomResponse) => {
        const { roomId, members, isOwner, gameId } = data;
        roomDispatch(RoomActions.changeListMemberOfRoom(members));
        roomDispatch(RoomActions.changeIsOwner(isOwner));
        roomDispatch(RoomActions.changeIsReconnecting(true));
        roomDispatch(RoomActions.changeIsReconnecting(true));
        roomDispatch(RoomActions.changeIsWaiting(false));
        gameDispatch(GameActions.changeCurrentGameId(gameId));
        navigate(ROUTES.QUIZZ.replace(":roomId", roomId));
      });

      setSocketInitialized(true);
      return () => {
        socket.current?.disconnect();
        setSocketInitialized(false);
      };
    }
  }, [authState.currentUser?.userId]);

  return (
    <SocketContext.Provider value={socket.current}>
      <Outlet />
    </SocketContext.Provider>
  );
};
