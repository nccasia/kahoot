import { AppActionType } from "@/interfaces/appTypes";
import { ICurrentUser } from "@/interfaces/authTypes";
import { IQuestionAnalyst, IQuestionGame, ITextQuestionAnalyst } from "@/interfaces/questionTypes";
import { IRoom, IUserPoint, IUserRanking } from "@/interfaces/roomTypes";

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
  CHANGE_CORRECT_ANSWER_OF_CURRENT_QUESTION = "CHANGE_CORRECT_ANSWER_OF_CURRENT_QUESTION",
  CHANGE_SELECTED_ANSWER = "CHANGE_SELECTED_ANSWER",
  CHANGE_TEXT_ANSWER = "CHANGE_TEXT_ANSWER",
  CHANGE_CORRECT_TEXT_ANSWER = "CHANGE_CORRECT_TEXT_ANSWER",
  CHANGE_IS_CORRECT = "CHANGE_IS_CORRECT",
  CHANGE_IS_SHOW_ANSWER = "CHANGE_IS_SHOW_ANSWER",
  CHANGE_MULTIPLE_CHOICE_SELECTED_ANSWERS = "CHANGE_MULTIPLE_CHOICE_SELECTED_ANSWERS",
  TOOGLE_MULTIPLE_CHOICE_SELECTED_ANSWERS = "TOOGLE_MULTIPLE_CHOICE_SELECTED_ANSWERS",
  CHANGE_LIST_QUESTION_ANALYSIS = "CHANGE_LIST_QUESTION_ANALYSIS",
  CHANGE_TEXT_QUESTION_ANALYSIS = "CHANGE_TEXT_QUESTION_ANALYSIS",
  CHANGE_LIST_USER_RANKING = "CHANGE_LIST_USER_RANKING",
  CHANGE_SUBMITED_USER = "CHANGE_SUBMITED_USER",
  CHANGE_USER_POINT = "CHANGE_USER_POINT",
  CHANGE_CURRENT_QUESTION_POINT = "CHANGE_CURRENT_QUESTION_POINT",
  CHANGE_TOTAL_POINT = "CHANGE_TOTAL_POINT",
  CHANGE_IS_END_GAME = "CHANGE_IS_END_GAME",
  CHANGE_IS_WAITING_END_GAME = "CHANGE_IS_WAITING_END_GAME",
  CHANGE_IS_RECONECTING = "CHANGE_IS_RECONECTING",
  CHANGE_TOTAL_QUESTION = "CHANGE_TOTAL_QUESTION",
  CHANGE_OPEN_MODAL_CONFIRM_END_GAME = "CHANGE_OPEN_MODAL_CONFIRM_END_GAME",
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

const changeCurrentQuestion = (currentQuestion?: IQuestionGame): AppActionType<ROOM_TYPE> => {
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

const changeCorrectAnswersOfCurrentQuestion = (correctAnswers: number[]): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_CORRECT_ANSWER_OF_CURRENT_QUESTION,
    payload: correctAnswers,
  };
};

const changeCorrectTextAnswer = (correctTextAnswer: string): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_CORRECT_TEXT_ANSWER,
    payload: correctTextAnswer,
  };
};

const changeListQuestionAnalysis = (data: {
  totalOptions: number;
  listQuestionAnalysis: IQuestionAnalyst[];
}): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_LIST_QUESTION_ANALYSIS,
    payload: data,
  };
};

const changeTextQuestionAnalysis = (data: {
  correctText: string;
  listQuestionAnalysis: ITextQuestionAnalyst[];
}): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_TEXT_QUESTION_ANALYSIS,
    payload: data,
  };
};

const changeUserRanking = (userRanking: IUserRanking[]): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_LIST_USER_RANKING,
    payload: userRanking,
  };
};

const changeSubmitedUser = (submitedUser: number): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_SUBMITED_USER,
    payload: submitedUser,
  };
};

const changeSelectedAnswers = (selectedAnswer: number[]): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_SELECTED_ANSWER,
    payload: selectedAnswer,
  };
};

const changeMultipleChoiceSelectedAnswers = (selectedAnswers: number[]): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_MULTIPLE_CHOICE_SELECTED_ANSWERS,
    payload: selectedAnswers,
  };
};

const toogleMultipleChoiceSelectedAnswer = (selectedAnswer: number): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.TOOGLE_MULTIPLE_CHOICE_SELECTED_ANSWERS,
    payload: selectedAnswer,
  };
};

const changeTextAnswer = (textAnswer: string): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_TEXT_ANSWER,
    payload: textAnswer,
  };
};

const changeUserPoint = (userPoint?: IUserPoint): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_USER_POINT,
    payload: userPoint,
  };
};

const changeCurrentQuestionPoint = (currentQuestionPoint: number): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_CURRENT_QUESTION_POINT,
    payload: currentQuestionPoint,
  };
};

const changeTotalPoint = (totalPoint: number): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_TOTAL_POINT,
    payload: totalPoint,
  };
};

const changeIsEndGame = (isEndGame: boolean): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_IS_END_GAME,
    payload: isEndGame,
  };
};

const changeIsWaitingEndGame = (isWaitingEndGame: boolean): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_IS_WAITING_END_GAME,
    payload: isWaitingEndGame,
  };
};

const changeIsReconnecting = (isReconnecting: boolean): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_IS_RECONECTING,
    payload: isReconnecting,
  };
};

const changeTotalQuestion = (totalQuestion: number): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_TOTAL_QUESTION,
    payload: totalQuestion,
  };
};

const changeOpenModalConfirmEndGame = (isOpen: boolean): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_OPEN_MODAL_CONFIRM_END_GAME,
    payload: isOpen,
  };
};

const changeIsShowAnswer = (isShowAnswer: boolean): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_IS_SHOW_ANSWER,
    payload: isShowAnswer,
  };
};

const changeIsCorrect = (isCorrect: boolean): AppActionType<ROOM_TYPE> => {
  return {
    type: ROOM_TYPE.CHANGE_IS_CORRECT,
    payload: isCorrect,
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
  changeCorrectAnswersOfCurrentQuestion,
  changeCorrectTextAnswer,
  changeTextAnswer,
  changeListQuestionAnalysis,
  changeTextQuestionAnalysis,
  changeUserRanking,
  changeSubmitedUser,
  changeSelectedAnswers,
  changeMultipleChoiceSelectedAnswers,
  toogleMultipleChoiceSelectedAnswer,
  changeUserPoint,
  changeCurrentQuestionPoint,
  changeTotalPoint,
  changeIsEndGame,
  changeIsWaitingEndGame,
  changeIsReconnecting,
  changeTotalQuestion,
  changeOpenModalConfirmEndGame,
  changeIsShowAnswer,
  changeIsCorrect,
};
export default RoomActions;
