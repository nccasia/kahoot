import { AppActionType } from "@/interfaces/appTypes";
import { IRoom } from "@/interfaces/roomTypes";

export enum ROOM_TYPE {
  CHANGE_CURRENT_ROOM = "CHANGE_CURRENT_ROOM",
}

const changeCurrentRoom = (currentRoom: IRoom): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_CURRENT_ROOM,
    payload: currentRoom,
  };
};

const RoomActions = {
  changeCurrentRoom,
};
export default RoomActions;
