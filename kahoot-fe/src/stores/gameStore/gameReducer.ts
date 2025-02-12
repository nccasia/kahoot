import { AppActionType } from "@/interfaces/appTypes";
import { IQuestion } from "@/interfaces/questionTypes";
import { GAME_TYPE } from "./gameAction";

export interface GameState {
  listQuestions: IQuestion[];
  selectedQuestion?: IQuestion;
  loading: boolean;
}

export const initGameState: GameState = {
  listQuestions: [],
  selectedQuestion: undefined,
  loading: false,
};

const GameReducer = (state = initGameState, action: AppActionType<GAME_TYPE>): GameState => {
  switch (action.type) {
    case GAME_TYPE.ADD_QUESTION:
      return {
        ...state,
        listQuestions: [...state.listQuestions, action.payload],
      };

    case GAME_TYPE.CHANGE_LIST_QUESTION: {
      return {
        ...state,
        listQuestions: action.payload,
      };
    }
    case GAME_TYPE.CHANGE_SELECTED_QUESTION: {
      const quesiton = state.listQuestions.find((item) => item.id === action.payload);
      return {
        ...state,
        selectedQuestion: quesiton,
      };
    }

    case GAME_TYPE.CHANGE_QUESTION_VALUE: {
      const newListQuestion = state.listQuestions.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
      if (state.selectedQuestion?.id === action.payload.id) {
        return {
          ...state,
          listQuestions: newListQuestion,
          selectedQuestion: action.payload,
        };
      }
      return {
        ...state,
        listQuestions: newListQuestion,
      };
    }
    default:
      return state;
  }
};
export default GameReducer;
