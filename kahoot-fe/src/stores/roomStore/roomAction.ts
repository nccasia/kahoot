import { AppActionType } from "@/interfaces/appTypes";
import { ICurrentUser, IUser } from "@/interfaces/authTypes";
import { IRoom } from "@/interfaces/roomTypes";

export enum ROOM_TYPE {
  CHANGE_CURRENT_ROOM = "CHANGE_CURRENT_ROOM",
  CHANGE_LIST_MEMBER_OF_ROOM = "CHANGE_LIST_MEMBER_OF_ROOM",
  USER_JOIN_ROOM = "USER_JOIN_ROOM",
  USER_LEAVE_ROOM = "USER_LEAVE_ROOM",
}

const changeCurrentRoom = (currentRoom: IRoom): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_CURRENT_ROOM,
    payload: currentRoom,
  };
};

const changeListMemberOfRoom = (listMembers: IUser[]): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_LIST_MEMBER_OF_ROOM,
    payload: listMembers,
  };
};

const userJoinRoom = (user: ICurrentUser): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.USER_JOIN_ROOM,
    payload: user,
  };
};

const userLeaveRoom = (user: ICurrentUser): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.USER_LEAVE_ROOM,
    payload: user,
  };
};

const RoomActions = {
  changeCurrentRoom,
  changeListMemberOfRoom,
  userJoinRoom,
  userLeaveRoom,
};
export default RoomActions;
