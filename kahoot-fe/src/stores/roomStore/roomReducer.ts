import { AppActionType } from "@/interfaces/appTypes";
import { ICurrentUser } from "@/interfaces/authTypes";
import { IQuestionAnalyst, IQuestionGame } from "@/interfaces/questionTypes";
import { IRoom, IUserPoint, IUserRanking } from "@/interfaces/roomTypes";
import { ROOM_TYPE } from "./roomAction";

export interface RoomState {
  listMemberOfRoom?: ICurrentUser[];
  correctAnswerOfCurrentQuestions: number[];
  selectedAnswers: number[];
  multipleChoiceSelectedAnswers?: number[];
  textAnswer?: string;
  correctTextAnswer?: string;
  userRanking: IUserRanking[];
  submitedUser: number;
  loading: boolean;
  currentRoom?: IRoom;
  isOwner: boolean;
  totalQuestion?: number;
  currentQuestion?: IQuestionGame;
  listQuestionAnalyst: IQuestionAnalyst[];
  userPoint?: IUserPoint;
  isWaiting: boolean;
  isSubmitAnswer: boolean;
  isEndAnQuestion: boolean;
  isEndGame: boolean;
  isWaitingEndGame: boolean;
  openMdoalConfirmEndGame: boolean;
  isReconecting?: boolean;
}

export const initRoomState: RoomState = {
  listMemberOfRoom: [],
  correctAnswerOfCurrentQuestions: [],
  userRanking: [],
  listQuestionAnalyst: [],
  selectedAnswers: [],
  submitedUser: 0,
  loading: false,
  currentRoom: undefined,
  isOwner: false,
  currentQuestion: undefined,
  isWaiting: true,
  isSubmitAnswer: false,
  isEndAnQuestion: false,
  isEndGame: false,
  isWaitingEndGame: false,
  openMdoalConfirmEndGame: false,
  isReconecting: false,
};

const RoomReducer = (state = initRoomState, action: AppActionType<ROOM_TYPE>): RoomState => {
  switch (action.type) {
    case ROOM_TYPE.CHANGE_CURRENT_ROOM:
      return {
        ...state,
        currentRoom: action.payload,
      };

    case ROOM_TYPE.CHANGE_LIST_MEMBER_OF_ROOM:
      return {
        ...state,
        listMemberOfRoom: action.payload,
      };

    case ROOM_TYPE.USER_JOIN_ROOM: {
      const checkUserInList = state.listMemberOfRoom?.find((item) => item.userId === action.payload.userId);

      if (checkUserInList) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        listMemberOfRoom: [...((state?.listMemberOfRoom as ICurrentUser[]) || []), action.payload],
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

    case ROOM_TYPE.CHANGE_CORRECT_ANSWER_OF_CURRENT_QUESTION:
      return {
        ...state,
        correctAnswerOfCurrentQuestions: action.payload,
      };

    case ROOM_TYPE.CHANGE_LIST_QUESTION_ANALYSIS: {
      const listQuestionAnalysis: IQuestionAnalyst[] = Array.from({ length: action.payload.totalOptions }).map((_, index) => {
        const checkInPayload = action.payload?.listQuestionAnalysis?.find(
          (item: IQuestionAnalyst) => +item.answerIndex === index
        );
        const questionAnalysis: IQuestionAnalyst = {
          answerIndex: index,
          totalSeleted: checkInPayload ? checkInPayload.totalSeleted : 0,
        };
        return questionAnalysis;
      });
      return {
        ...state,
        listQuestionAnalyst: listQuestionAnalysis,
      };
    }

    case ROOM_TYPE.CHANGE_LIST_USER_RANKING:
      return {
        ...state,
        userRanking: action.payload,
      };

    case ROOM_TYPE.CHANGE_SUBMITED_USER:
      return {
        ...state,
        submitedUser: action.payload,
      };

    case ROOM_TYPE.CHANGE_SELECTED_ANSWER:
      return {
        ...state,
        selectedAnswers: action.payload,
      };

    case ROOM_TYPE.CHANGE_USER_POINT:
      return {
        ...state,
        userPoint: action.payload,
      };

    case ROOM_TYPE.CHANGE_CURRENT_QUESTION_POINT:
      return {
        ...state,
        userPoint: {
          ...state.userPoint,
          currentQuestionPoint: action.payload,
          totalPoint: state.userPoint?.totalPoint || 0,
          isCorrect: true,
        },
      };

    case ROOM_TYPE.CHANGE_TOTAL_POINT:
      return {
        ...state,
        userPoint: {
          ...state.userPoint,
          totalPoint: action.payload,
          currentQuestionPoint: state.userPoint?.currentQuestionPoint || 0,
          isCorrect: true,
        },
      };

    case ROOM_TYPE.CHANGE_TOTAL_QUESTION:
      return {
        ...state,
        totalQuestion: action.payload,
      };

    case ROOM_TYPE.CHANGE_IS_END_GAME:
      return {
        ...state,
        isEndGame: action.payload,
      };

    case ROOM_TYPE.CHANGE_IS_WAITING_END_GAME:
      return {
        ...state,
        isWaitingEndGame: action.payload,
      };

    case ROOM_TYPE.CHANGE_IS_RECONECTING:
      return {
        ...state,
        isReconecting: action.payload,
      };

    case ROOM_TYPE.CHANGE_OPEN_MODAL_CONFIRM_END_GAME:
      return {
        ...state,
        openMdoalConfirmEndGame: action.payload,
      };

    case ROOM_TYPE.CHANGE_MULTIPLE_CHOICE_SELECTED_ANSWERS:
      return {
        ...state,
        multipleChoiceSelectedAnswers: action.payload,
      };

    case ROOM_TYPE.TOOGLE_MULTIPLE_CHOICE_SELECTED_ANSWERS: {
      const checkInSelectedAnswers = state.multipleChoiceSelectedAnswers?.find((item) => item === action.payload);
      let newSelectedAnswers: number[] = state.multipleChoiceSelectedAnswers || [];
      if (checkInSelectedAnswers || checkInSelectedAnswers === 0) {
        newSelectedAnswers = newSelectedAnswers.filter((item) => item !== action.payload);
      } else {
        newSelectedAnswers = [...newSelectedAnswers, action.payload];
      }
      return {
        ...state,
        multipleChoiceSelectedAnswers: newSelectedAnswers,
      };
    }

    case ROOM_TYPE.CHANGE_TEXT_ANSWER:
      return {
        ...state,
        textAnswer: action.payload,
      };

    case ROOM_TYPE.CHANGE_CORRECT_TEXT_ANSWER:
      return {
        ...state,
        correctTextAnswer: action.payload,
      };

    default:
      return state;
  }
};
export default RoomReducer;
