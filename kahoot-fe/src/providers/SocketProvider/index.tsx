import { DefaultEventsMap } from "@socket.io/component-emitter";
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";

const SocketContext = createContext<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const [socketInitialized, setSocketInitialized] = useState(false);
  const [mezonUser, setMezonUser] = useState<MezonUser | null>(null);
  // useEffect(() => {
  //   window.Mezon.WebView?.postEvent("PING" as MezonWebViewEvent, { message: "PING" }, () => {
  //     console.log("PING");
  //   });
  //   window.Mezon.WebView?.onEvent("CURRENT_USER_INFO" as MezonAppEvent, (_, userData: any) => {
  //     if (!userData || !userData.user) {
  //       return;
  //     }
  //     const user: MezonUser = {
  //       id: userData.user?.id,
  //       displayName: userData.user?.display_name,
  //       username: userData.user?.username,
  //       avatar: userData.user?.avatar_url,
  //       email: userData?.email,
  //       wallet: JSON.parse(userData?.wallet ?? "")?.value ?? 0,
  //       dob: userData?.user?.dob,
  //       googleId: userData?.user?.google_id,
  //       metadata: userData?.user?.metadata,
  //     };
  //     setMezonUser(user);
  //   });
  // }, []);

  useEffect(() => {
    // if (!socketInitialized && mezonUser?.id) {
    //   socket.current = io(ENV.BACKEND_URL, {
    //     withCredentials: true,
    //     query: {},
    //   });
    //   socket.current.on("connect", () => {
    //     console.log("Connected to socket");
    //   });
    //   setSocketInitialized(true);
    //   return () => {
    //     socket.current?.disconnect();
    //     setSocketInitialized(false);
    //   };
    // }
  }, [mezonUser?.id]);

  return <SocketContext.Provider value={socket.current}>{children}</SocketContext.Provider>;
};
