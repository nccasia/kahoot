import { AppActionType } from "@/interfaces/appTypes";
import { IRoom } from "@/interfaces/roomTypes";
import { ROOM_TYPE } from "./roomAction";

export interface RoomState {
  loading: boolean;
  currentRoom?: IRoom;
}

export const initRoomState: RoomState = {
  loading: false,
  currentRoom: undefined,
};

const RoomReducer = (state = initRoomState, action: AppActionType<ROOM_TYPE>): RoomState => {
  switch (action.type) {
    case ROOM_TYPE.CHANGE_CURRENT_ROOM:
      return {
        ...state,
        currentRoom: action.payload,
      };
    default:
      return state;
  }
};
export default RoomReducer;
