import { AppActionType } from "@/interfaces/appTypes";
import { APP_TYPE } from "./appAction";

export interface AppState {
  loading: boolean;
  isShowSplash: boolean;
  isPlayCorrectSound: boolean;
  isPlayErrorSound: boolean;
}

export const initAppState: AppState = {
  loading: false,
  isShowSplash: true,
  isPlayCorrectSound: false,
  isPlayErrorSound: false,
};

const AppReducer = (state = initAppState, action: AppActionType<APP_TYPE>): AppState => {
  switch (action.type) {
    case APP_TYPE.START_LOADING:
      return {
        ...state,
        loading: true,
      };
    case APP_TYPE.END_LOADING:
      return {
        ...state,
        loading: false,
      };
    case APP_TYPE.CHANGE_IS_SHOW_SPLASH:
      return {
        ...state,
        isShowSplash: action.payload,
      };

    case APP_TYPE.CHANGE_IS_PLAY_CORRECT_SOUND:
      return {
        ...state,
        isPlayCorrectSound: action.payload,
      };

    case APP_TYPE.CHANGE_IS_PLAY_ERROR_SOUND:
      return {
        ...state,
        isPlayErrorSound: action.payload,
      };

    default:
      return state;
  }
};
export default AppReducer;
