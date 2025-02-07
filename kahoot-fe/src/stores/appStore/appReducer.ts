import { AppActionType } from "@/types/appTypes";
import { APP_TYPE } from "./appAction";

export interface AppState {
  loading: boolean;
}

export const initAppState: AppState = {
  loading: false,
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
    default:
      return state;
  }
};
export default AppReducer;
