import { AppActionType } from "@/interfaces/appTypes";
import { IGame } from "@/interfaces/gameTypes";
import { IQuestion } from "@/interfaces/questionTypes";

export enum GAME_TYPE {
  ADD_QUESTION = "ADD_QUESTION",
  CHANGE_LIST_QUESTION = "CHANGE_LIST_QUESTION",
  CHANGE_SELECTED_QUESTION = "CHANGE_SELECTED_QUESTION",
  CHANGE_QUESTION_VALUE = "CHANGE_QUESTION_VALUE",
  CHANGE_OPEN_MODAL_SAVE_GAME = "CHANGE_OPEN_MODAL_SAVE_GAME",
  CHANGE_LIST_GAME = "CHANGE_LIST_GAME",
  CHANGE_FILTER_GAMES = "CHANGE_FILTER_GAMES",
  CHANGE_SELECTED_GAME = "CHANGE_SELECTED_GAME",
  CHANGE_CURRETN_GAME_ID = "CHANGE_CURRETN_GAME_ID",
}

const addQuestion = (question: IQuestion): AppActionType<GAME_TYPE> => {
  return {
    type: GAME_TYPE.ADD_QUESTION,
    payload: question,
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

const GameActions = {
  addQuestion,
  changeListQuestion,
  changeSelectedQuestion,
  changeQuestionValue,
  changeOpenModalSaveGame,
  changeListGame,
  changeFilterGames,
  changeSelectedGame,
  changeCurrentGameId,
};
export default GameActions;
