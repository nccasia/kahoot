import { AppActionType } from "@/interfaces/appTypes";
import { ICurrentUser } from "@/interfaces/authTypes";
import { IQuestionGame } from "@/interfaces/questionTypes";
import { IRoom } from "@/interfaces/roomTypes";

export enum ROOM_TYPE {
  CHANGE_CURRENT_ROOM = "CHANGE_CURRENT_ROOM",
  CHANGE_LIST_MEMBER_OF_ROOM = "CHANGE_LIST_MEMBER_OF_ROOM",
  USER_JOIN_ROOM = "USER_JOIN_ROOM",
  USER_LEAVE_ROOM = "USER_LEAVE_ROOM",
  CHANGE_IS_OWNER = "CHANGE_IS_OWNER",
  CHANGE_IS_WAITING = "CHANGE_IS_WAITING",
  CHANGE_CURRENT_QUESTION = "CHANGE_CURRENT_QUESTION",
  CHANGE_IS_SUBMIT_ANSWER = "CHANGE_IS_SUBMIT_ANSWER",
  CHANGE_IS_END_AN_QUESTION = "CHANGE_IS_END_AN_QUESTION",
}

const changeCurrentRoom = (currentRoom: IRoom): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_CURRENT_ROOM,
    payload: currentRoom,
  };
};

const changeListMemberOfRoom = (listMembers: ICurrentUser[]): AppActionType<ROOM_TYPE> => {
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

const changeIsOwner = (isOwner: boolean): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_IS_OWNER,
    payload: isOwner,
  };
};

const changeIsWaiting = (isWaiting: boolean): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_IS_WAITING,
    payload: isWaiting,
  };
};

const changeCurrentQuestion = (currentQuestion: IQuestionGame): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_CURRENT_QUESTION,
    payload: currentQuestion,
  };
};

const changeIsSubmitAnswer = (isSubmitAnswer: boolean): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_IS_SUBMIT_ANSWER,
    payload: isSubmitAnswer,
  };
};

const changeIsEndAnQuestion = (isEndAnQuestion: boolean): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_IS_END_AN_QUESTION,
    payload: isEndAnQuestion,
  };
};

const RoomActions = {
  changeCurrentRoom,
  changeListMemberOfRoom,
  userJoinRoom,
  userLeaveRoom,
  changeIsOwner,
  changeIsWaiting,
  changeCurrentQuestion,
  changeIsSubmitAnswer,
  changeIsEndAnQuestion,
};
export default RoomActions;
