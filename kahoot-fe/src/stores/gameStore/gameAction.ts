import { AppActionType } from "@/interfaces/appTypes";
import { IGame } from "@/interfaces/gameTypes";
import { IQuestion } from "@/interfaces/questionTypes";
import { IRoom } from "@/interfaces/roomTypes";

export enum GAME_TYPE {
  ADD_QUESTION = "ADD_QUESTION",
  DELETE_QUESTION = "DELETE_QUESTION",
  CHANGE_LIST_QUESTION = "CHANGE_LIST_QUESTION",
  CHANGE_SELECTED_QUESTION = "CHANGE_SELECTED_QUESTION",
  CHANGE_SELECTED_QUESTION_INDEX = "CHANGE_SELECTED_QUESTION_INDEX",
  CHANGE_QUESTION_VALUE = "CHANGE_QUESTION_VALUE",
  CHANGE_OPEN_MODAL_SAVE_GAME = "CHANGE_OPEN_MODAL_SAVE_GAME",
  CHANGE_LIST_GAME = "CHANGE_LIST_GAME",
  CHANGE_FILTER_GAMES = "CHANGE_FILTER_GAMES",
  CHANGE_SELECTED_GAME = "CHANGE_SELECTED_GAME",
  CHANGE_CURRETN_GAME_ID = "CHANGE_CURRETN_GAME_ID",
  CHANGE_OPEN_MODAL_CONFIRM_DELETE_GAME = "CHANGE_OPEN_MODAL_CONFIRM_DELETE_GAME",
  CHANGE_OPEN_MODAL_CONFIRM_DELETE_QUESTION = "CHANGE_OPEN_MODAL_CONFIRM_DELETE_QUESTION",
  CHANGE_SELECTED_GAME_ID = "CHANGE_SELECTED_GAME_ID",
  CHANGE_IS_SUBMITTING = "CHANGE_IS_SUBMITTING",
  CHANGE_IS_UPDATE_QUESTION_OF_GAME = "CHANGE_IS_UPDATE_QUESTION_OF_GAME",
  CHANGE_IS_UPDATE_GAME = "CHANGE_IS_UPDATE_GAME",
  CHANGE_IS_CREATE_QUESTION_OF_GAME = "CHANGE_IS_CREATE_QUESTION_OF_GAME",
  CHANGE_OLD_QUESTION_DATA = "CHANGE_OLD_QUESTION_DATA",
  CHANGE_IS_DELETING_QUESTION = "CHANGE_IS_DELETING_QUESTION",
  CHANGE_LIST_ROOMS = "CHANGE_LIST_ROOMS",
}

const addQuestion = (question: IQuestion[]): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.ADD_QUESTION,
    payload: question,
  };
};

const deleteQuestion = (questionId: string): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.DELETE_QUESTION,
    payload: questionId,
  };
};

const changeListQuestion = (listQuestions: IQuestion[]): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_LIST_QUESTION,
    payload: listQuestions,
  };
};

const changeSelectedQuestion = (questionId: string): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_SELECTED_QUESTION,
    payload: questionId,
  };
};

const changeSelectedQuestionIndex = (questionIndex: number): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_SELECTED_QUESTION_INDEX,
    payload: questionIndex,
  };
};

const changeQuestionValue = (question: IQuestion): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_QUESTION_VALUE,
    payload: question,
  };
};

const changeOpenModalSaveGame = (isOpen: boolean): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_OPEN_MODAL_SAVE_GAME,
    payload: isOpen,
  };
};

const changeListGame = (listGames: IGame[]): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_LIST_GAME,
    payload: listGames,
  };
};

const changeFilterGames = (filterGames: IGame[]): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_FILTER_GAMES,
    payload: filterGames,
  };
};

const changeSelectedGame = (game: IGame | null): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_SELECTED_GAME,
    payload: game,
  };
};

const changeCurrentGameId = (gameId?: string): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_CURRETN_GAME_ID,
    payload: gameId,
  };
};

const changeOpenModalConfirmDeleteGame = (isOpen: boolean): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_OPEN_MODAL_CONFIRM_DELETE_GAME,
    payload: isOpen,
  };
};

const changeOpenModalConfirmDeleteQuestion = (isOpen: boolean): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_OPEN_MODAL_CONFIRM_DELETE_QUESTION,
    payload: isOpen,
  };
};

const changeSelectedGameId = (gameId: string): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_SELECTED_GAME_ID,
    payload: gameId,
  };
};

const changeIsUpdateQuestionOfGame = (isUpdate: boolean): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_IS_UPDATE_QUESTION_OF_GAME,
    payload: isUpdate,
  };
};

const changeIsUpdateGame = (isUpdate: boolean): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_IS_UPDATE_GAME,
    payload: isUpdate,
  };
};

const changeOldQuestionData = (question: IQuestion): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_OLD_QUESTION_DATA,
    payload: question,
  };
};

const changeIsCreateQuestionOfGame = (isCreate: boolean): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_IS_CREATE_QUESTION_OF_GAME,
    payload: isCreate,
  };
};

const changeIsSubmitting = (isSubmitting: boolean): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_IS_SUBMITTING,
    payload: isSubmitting,
  };
};

const changeIsDeleting = (isDeleting: boolean): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_IS_DELETING_QUESTION,
    payload: isDeleting,
  };
};
const changeListRooms = (listRooms: IRoom[]): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.CHANGE_LIST_ROOMS,
    payload: listRooms,
  };
};

const GameActions = {
  changeListRooms,
  addQuestion,
  deleteQuestion,
  changeListQuestion,
  changeSelectedQuestion,
  changeSelectedQuestionIndex,
  changeQuestionValue,
  changeOpenModalSaveGame,
  changeListGame,
  changeFilterGames,
  changeSelectedGame,
  changeCurrentGameId,
  changeOpenModalConfirmDeleteGame,
  changeOpenModalConfirmDeleteQuestion,
  changeSelectedGameId,
  changeIsUpdateQuestionOfGame,
  changeIsCreateQuestionOfGame,
  changeIsUpdateGame,
  changeOldQuestionData,
  changeIsSubmitting,
  changeIsDeleting,
};
export default GameActions;
