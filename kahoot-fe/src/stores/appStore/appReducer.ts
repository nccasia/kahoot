import { AppActionType } from "@/interfaces/appTypes";
import { APP_TYPE } from "./appAction";

export interface AppState {
  loading: boolean;
  isShowSplash: boolean;
  isPlayCorrectSound: boolean;
  isPlayErrorSound: boolean;
  clanId?: string;
  channelId?: string;
}

export const initAppState: AppState = {
  loading: false,
  isShowSplash: true,
  isPlayCorrectSound: false,
  isPlayErrorSound: false,
  clanId: undefined,
  channelId: undefined,
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
    case APP_TYPE.CHANGE_CHANNEL_ID:
      return {
        ...state,
        clanId: action.payload.clanId,
        channelId: action.payload.channelId,
      };
    default:
      return state;
  }
};
export default AppReducer;
