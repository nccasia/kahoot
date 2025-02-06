import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import ENV from "@/constants/Environment";

const SocketContext = createContext<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const [socketInitialized, setSocketInitialized] = useState(false);

  useEffect(() => {
    if (!socketInitialized) {
      socket.current = io(ENV.BACKEND_URL, {
        withCredentials: true,
        query: {},
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
  }, [socketInitialized]);

  return <SocketContext.Provider value={socket.current}>{children}</SocketContext.Provider>;
};
