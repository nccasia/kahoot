import { AppActionType } from "@/interfaces/appTypes";
import { ICurrentUser } from "@/interfaces/authTypes";
import { IQuestionGame } from "@/interfaces/questionTypes";
import { IRoom } from "@/interfaces/roomTypes";
import { ROOM_TYPE } from "./roomAction";

export interface RoomState {
  listMemberOfRoom?: ICurrentUser[];
  loading: boolean;
  currentRoom?: IRoom;
  isOwner: boolean;
  currentQuestion?: IQuestionGame;
  isWaiting: boolean;
  isSubmitAnswer: boolean;
  isEndAnQuestion: boolean;
}

export const initRoomState: RoomState = {
  listMemberOfRoom: [],
  loading: false,
  currentRoom: undefined,
  isOwner: false,
  currentQuestion: undefined,
  isWaiting: true,
  isSubmitAnswer: false,
  isEndAnQuestion: false,
};

const RoomReducer = (state = initRoomState, action: AppActionType<ROOM_TYPE>): RoomState => {
  switch (action.type) {
    case ROOM_TYPE.CHANGE_CURRENT_ROOM:
      return {
        ...state,
        currentRoom: action.payload,
      };

    case ROOM_TYPE.CHANGE_LIST_MEMBER_OF_ROOM:
      console.log("Change list member of room: ", action.payload);
      return {
        ...state,
        listMemberOfRoom: action.payload,
      };

    case ROOM_TYPE.USER_JOIN_ROOM: {
      const checkUserInList = state.listMemberOfRoom?.find((item) => item.userId === action.payload.userId);
      console.log("listMemberOfRoom: ", state.listMemberOfRoom);
      console.log("UserId: ", action.payload.userId);

      if (checkUserInList) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        listMemberOfRoom: [...(state.listMemberOfRoom as ICurrentUser[]), action.payload],
      };
    }

    case ROOM_TYPE.USER_LEAVE_ROOM: {
      const newListMember = state.listMemberOfRoom?.filter((item) => item.userId !== action.payload.userId);
      return {
        ...state,
        listMemberOfRoom: newListMember,
      };
    }

    case ROOM_TYPE.CHANGE_IS_OWNER:
      return {
        ...state,
        isOwner: action.payload,
      };

    case ROOM_TYPE.CHANGE_IS_WAITING:
      return {
        ...state,
        isWaiting: action.payload,
      };

    case ROOM_TYPE.CHANGE_CURRENT_QUESTION:
      return {
        ...state,
        currentQuestion: action.payload,
      };

    case ROOM_TYPE.CHANGE_IS_SUBMIT_ANSWER:
      return {
        ...state,
        isSubmitAnswer: action.payload,
      };

    case ROOM_TYPE.CHANGE_IS_END_AN_QUESTION:
      return {
        ...state,
        isEndAnQuestion: action.payload,
      };

    default:
      return state;
  }
};
export default RoomReducer;
