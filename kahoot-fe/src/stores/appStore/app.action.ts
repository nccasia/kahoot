import { AppActionType } from "../../types/appTypes";

export enum APP_TYPE {
  START_LOADING = "START_LOADING",
  END_LOADING = "END_LOADING",
}

const startLoading = (): AppActionType<APP_TYPE> => {
  return {
    type: APP_TYPE.START_LOADING,
    payload: null,
  };
};

const endLoading = (): AppActionType<APP_TYPE> => {
  return {
    type: APP_TYPE.END_LOADING,
    payload: null,
  };
};

const AppActions = {
  startLoading,
  endLoading,
};
export default AppActions;
