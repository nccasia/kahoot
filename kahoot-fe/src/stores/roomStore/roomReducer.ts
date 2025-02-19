import { AppActionType } from "@/interfaces/appTypes";
import { IUser } from "@/interfaces/authTypes";
import { IRoom } from "@/interfaces/roomTypes";
import { ROOM_TYPE } from "./roomAction";

export interface RoomState {
  listMemberOfRoom?: IUser[];
  loading: boolean;
  currentRoom?: IRoom;
}

export const initRoomState: RoomState = {
  listMemberOfRoom: [],
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

    case ROOM_TYPE.CHANGE_LIST_MEMBER_OF_ROOM:
      return {
        ...state,
        listMemberOfRoom: action.payload,
      };

    case ROOM_TYPE.USER_JOIN_ROOM: {
      const checkUserInList = state.listMemberOfRoom?.find((item) => item.id === action.payload.userId);
      if (checkUserInList) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        listMemberOfRoom: [...(state.listMemberOfRoom as IUser[]), action.payload],
      };
    }

    case ROOM_TYPE.USER_LEAVE_ROOM: {
      const newListMember = state.listMemberOfRoom?.filter((item) => item.id !== action.payload.userId);
      return {
        ...state,
        listMemberOfRoom: newListMember,
      };
    }

    default:
      return state;
  }
};
export default RoomReducer;
