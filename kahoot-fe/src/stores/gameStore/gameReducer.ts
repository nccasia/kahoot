import { QueryOptions } from "@/constants/QueryOption";
import { AppActionType } from "@/interfaces/appTypes";
import { IGame } from "@/interfaces/gameTypes";
import { IQuestion } from "@/interfaces/questionTypes";
import { IRoom } from "@/interfaces/roomTypes";
import { GAME_TYPE } from "./gameAction";

export interface GameState {
  listRooms: IRoom[];
  listQuestions: IQuestion[];
  listGames: IGame[];
  filterGames: IGame[];
  selectedQuestion?: IQuestion;
  selectedQuestionIndex: number;
  oldQuestionData?: IQuestion;
  selectedGame?: IGame | null;
  loading: boolean;
  openModalSaveGame: boolean;
  openModalConfirmDeleteGame: boolean;
  openModalConfirmDeleteQuestion: boolean;
  isUpdateQuestionOfGame: boolean;
  isCreateQuestionOfGame: boolean;
  isUpdateGame: boolean;
  selectedGameId: string;
  currentGameId?: string;
  isSubmitting: boolean;
  isDeleting: boolean;
}

export const initGameState: GameState = {
  listRooms: [],
  listQuestions: [],
  listGames: [],
  filterGames: [],
  selectedQuestion: undefined,
  loading: false,
  openModalSaveGame: false,
  openModalConfirmDeleteGame: false,
  openModalConfirmDeleteQuestion: false,
  isUpdateQuestionOfGame: false,
  isCreateQuestionOfGame: false,
  isSubmitting: false,
  isUpdateGame: false,
  isDeleting: false,
  selectedGameId: "",
  selectedGame: null,
  selectedQuestionIndex: 0,
};

const GameReducer = (state = initGameState, action: AppActionType<GAME_TYPE>): GameState => {
  switch (action.type) {
    case GAME_TYPE.ADD_QUESTION:
      return {
        ...state,
        listQuestions: [...state.listQuestions, ...action.payload],
      };

    case GAME_TYPE.DELETE_QUESTION:
      return {
        ...state,
        listQuestions: state.listQuestions.filter((item) => item.id !== action.payload),
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

    case GAME_TYPE.CHANGE_SELECTED_QUESTION_INDEX: {
      return {
        ...state,
        selectedQuestionIndex: action.payload,
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

    case GAME_TYPE.CHANGE_CURRETN_GAME_ID: {
      return {
        ...state,
        currentGameId: action.payload,
      };
    }

    case GAME_TYPE.CHANGE_OPEN_MODAL_CONFIRM_DELETE_GAME: {
      return {
        ...state,
        openModalConfirmDeleteGame: action.payload,
      };
    }

    case GAME_TYPE.CHANGE_OPEN_MODAL_CONFIRM_DELETE_QUESTION: {
      return {
        ...state,
        openModalConfirmDeleteQuestion: action.payload,
      };
    }

    case GAME_TYPE.CHANGE_SELECTED_GAME_ID: {
      return {
        ...state,
        selectedGameId: action.payload,
      };
    }

    case GAME_TYPE.CHANGE_IS_UPDATE_QUESTION_OF_GAME: {
      return {
        ...state,
        isUpdateQuestionOfGame: action.payload,
      };
    }

    case GAME_TYPE.CHANGE_IS_CREATE_QUESTION_OF_GAME: {
      return {
        ...state,
        isCreateQuestionOfGame: action.payload,
      };
    }

    case GAME_TYPE.CHANGE_IS_UPDATE_GAME: {
      return {
        ...state,
        isUpdateGame: action.payload,
      };
    }

    case GAME_TYPE.CHANGE_OLD_QUESTION_DATA: {
      return {
        ...state,
        oldQuestionData: action.payload,
      };
    }

    case GAME_TYPE.CHANGE_IS_SUBMITTING: {
      return {
        ...state,
        isSubmitting: action.payload,
      };
    }

    case GAME_TYPE.CHANGE_IS_DELETING_QUESTION: {
      return {
        ...state,
        isDeleting: action.payload,
      };
    }
    case GAME_TYPE.CHANGE_LIST_ROOMS: {
      return {
        ...state,
        listRooms: action.payload,
      };
    }
    case GAME_TYPE.ADD_ROOM: {
      const listRooms = state.listRooms;
      if (listRooms.length == QueryOptions.MAX_HISTORY_SIZE) {
        listRooms.pop();
      }
      return {
        ...state,
        listRooms: [action.payload, ...listRooms],
      };
    }
    case GAME_TYPE.UPDATE_SCHEDULED_ROOM: {
      const listRooms = state.listRooms.map((item: IRoom) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
      return {
        ...state,
        listRooms: listRooms,
      };
    }
    default:
      return state;
  }
};
export default GameReducer;
