import ENV from "@/constants/Environment";
import SocketEvents from "@/constants/SocketEvents";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AuthContext } from "../ContextProvider/AuthProvider";

const SocketContext = createContext<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const [socketInitialized, setSocketInitialized] = useState(false);
  const { authState } = useContext(AuthContext);

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
          "Bypass-Tunnel-Reminder": "true",
          "ngrok-skip-browser-warning": "true",
          "X-Kahoot-User": JSON.stringify({
            userId: authState.currentUser.userId,
            mezonUserId: authState.currentUser.mezonUserId,
            email: authState.currentUser.email,
            userName: authState.currentUser.userName,
            avatar: authState.currentUser.avatar,
          }),
        },
      });
      socket.current.on("connect", () => {
        console.log("Connected to socket");
      });
      socket.current.on(SocketEvents.ON.ClientError, (error) => {
        console.log("Socket error", error);
      });
      setSocketInitialized(true);
      return () => {
        socket.current?.disconnect();
        setSocketInitialized(false);
      };
    }
  }, [authState.currentUser?.userId]);

  return <SocketContext.Provider value={socket.current}>{children}</SocketContext.Provider>;
};
