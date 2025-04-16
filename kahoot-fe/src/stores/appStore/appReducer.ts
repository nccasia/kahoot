import { AppActionType, IChannelInfo } from "@/interfaces/appTypes";
import { APP_TYPE } from "./appAction";

export interface AppState {
  loading: boolean;
  isShowSplash: boolean;
  isPlayCorrectSound: boolean;
  isPlayErrorSound: boolean;
  currentChannel?: IChannelInfo;
  channelList?: IChannelInfo[];
  clanId?: string;
}

export const initAppState: AppState = {
  loading: false,
  isShowSplash: true,
  isPlayCorrectSound: false,
  isPlayErrorSound: false,
  clanId: undefined,
  currentChannel: undefined,
  channelList: [],
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
    case APP_TYPE.CHANGE_CHANNEL:
      return {
        ...state,
        clanId: action.payload.clanId,
        currentChannel: action.payload,
      };
    case APP_TYPE.CHANGE_CHANNEL_LIST:
      return {
        ...state,
        channelList: action.payload,
      };
    default:
      return state;
  }
};
export default AppReducer;
