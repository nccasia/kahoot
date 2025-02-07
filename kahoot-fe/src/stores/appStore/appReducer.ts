import { AppActionType } from "@/types/appTypes";
import { APP_TYPE } from "./appAction";

export interface AppState {
  loading: boolean;
  isShowSplash: boolean;
}

export const initAppState: AppState = {
  loading: false,
  isShowSplash: true,
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
    default:
      return state;
  }
};
export default AppReducer;
