import { AppActionType } from "@/interfaces/appTypes";
import { IQuestion } from "@/interfaces/questionTypes";

export enum GAME_TYPE {
  ADD_QUESTION = "ADD_QUESTION",
  CHANGE_LIST_QUESTION = "CHANGE_LIST_QUESTION",
  CHANGE_SELECTED_QUESTION = "CHANGE_SELECTED_QUESTION",
  CHANGE_QUESTION_VALUE = "CHANGE_QUESTION_VALUE",
  CHANGE_OPEN_MODAL_SAVE_GAME = "CHANGE_OPEN_MODAL_SAVE_GAME",
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

const GameActions = {
  addQuestion,
  changeListQuestion,
  changeSelectedQuestion,
  changeQuestionValue,
  changeOpenModalSaveGame,
};
export default GameActions;
