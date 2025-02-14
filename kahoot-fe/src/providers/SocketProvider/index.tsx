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
      socket.current = io("http://localhost:3000/QUIZ", {
        withCredentials: true,
        query: { userId: authState.currentUser.userId },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 3000,
        extraHeaders: {
          userId: authState.currentUser.userId,
          mezonUserId: authState.currentUser.mezonUserId,
          email: authState.currentUser.email,
          userName: authState.currentUser.userName,
          avatar: authState.currentUser.avatar,
        },
      });
      socket.current.on("connect", () => {
        console.log("Connected to socket");
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
