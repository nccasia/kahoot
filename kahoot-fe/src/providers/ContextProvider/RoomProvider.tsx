import { AppActionType } from "@/interfaces/appTypes";
import { ROOM_TYPE } from "@/stores/roomStore/roomAction";
import RoomReducer, { initRoomState, RoomState } from "@/stores/roomStore/roomReducer";
import React, { createContext, Dispatch, useReducer } from "react";

type RoomDispatch = Dispatch<AppActionType<ROOM_TYPE>>;

export const RoomContext = createContext<{ roomState: RoomState; roomDispatch: RoomDispatch }>({
  roomState: initRoomState,
  roomDispatch: () => {}, // Provide a default function to avoid TypeScript errors
});

const RoomProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [roomState, roomDispatch] = useReducer(RoomReducer, initRoomState);

  return <RoomContext.Provider value={{ roomState, roomDispatch }}>{children}</RoomContext.Provider>;
};

export default RoomProvider;
