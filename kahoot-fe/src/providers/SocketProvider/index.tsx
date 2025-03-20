import ENV from "@/constants/Environment";
import SocketEvents from "@/constants/SocketEvents";
import { IJoinRoomResponse } from "@/interfaces/roomTypes";
import { ROUTES } from "@/routes/routePath";
import GameActions from "@/stores/gameStore/gameAction";
import RoomActions from "@/stores/roomStore/roomAction";
import { MezonWebViewEvent } from "@/types/webview";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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
        toast.error(error.message);
      });

      socket.current.on(SocketEvents.ON.UserReconnectedRoom, (data: IJoinRoomResponse) => {
        const { roomId, members, isOwner, gameId, roomStatus } = data;
        roomDispatch(RoomActions.changeIsOwner(isOwner));
        roomDispatch(RoomActions.changeListMemberOfRoom(members));
        gameDispatch(GameActions.changeCurrentGameId(gameId));
        roomDispatch(RoomActions.changeIsWaiting(false));

        if (roomStatus === "waiting") {
          navigate(ROUTES.WAITING_ROOM.replace(":roomId", roomId));
          return;
        }

        roomDispatch(RoomActions.changeIsReconnecting(true));
        navigate(ROUTES.QUIZZ.replace(":roomId", roomId));
        window.Mezon.WebView?.postEvent(
          "JOIN_ROOM" as MezonWebViewEvent,
          {
            roomId: roomId,
          },
          () => {}
        );
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
