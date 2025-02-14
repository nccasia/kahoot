import { AppActionType } from "@/interfaces/appTypes";
import { IGame } from "@/interfaces/gameTypes";
import { IQuestion } from "@/interfaces/questionTypes";
import { GAME_TYPE } from "./gameAction";

export interface GameState {
  listQuestions: IQuestion[];
  listGames: IGame[];
  filterGames: IGame[];
  selectedQuestion?: IQuestion;
  selectedGame?: IGame | null;
  loading: boolean;
  openModalSaveGame: boolean;
}

export const initGameState: GameState = {
  listQuestions: [],
  listGames: [],
  filterGames: [],
  selectedQuestion: undefined,
  loading: false,
  openModalSaveGame: false,
  selectedGame: null,
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

    case GAME_TYPE.CHANGE_OPEN_MODAL_SAVE_GAME: {
      return {
        ...state,
        openModalSaveGame: action.payload,
      };
    }

    case GAME_TYPE.CHANGE_LIST_GAME: {
      return {
        ...state,
        listGames: action.payload,
      };
    }

    case GAME_TYPE.CHANGE_FILTER_GAMES: {
      return {
        ...state,
        filterGames: action.payload,
      };
    }

    case GAME_TYPE.CHANGE_SELECTED_GAME: {
      return {
        ...state,
        selectedGame: action.payload,
      };
    }

    default:
      return state;
  }
};
export default GameReducer;
