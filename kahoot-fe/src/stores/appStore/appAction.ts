import { AppActionType } from "@/interfaces/appTypes";

export enum APP_TYPE {
  START_LOADING = "START_LOADING",
  END_LOADING = "END_LOADING",
  CHANGE_IS_SHOW_SPLASH = "CHANGE_IS_SHOW_SPLASH",
  CHANGE_IS_PLAY_CORRECT_SOUND = "CHANGE_IS_PLAY_CORRECT_SOUND",
  CHANGE_IS_PLAY_ERROR_SOUND = "CHANGE_IS_PLAY_ERROR_SOUND",
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

const changeIsShowSplash = (isShowSplash: boolean): AppActionType<APP_TYPE> => {
  return {
    type: APP_TYPE.CHANGE_IS_SHOW_SPLASH,
    payload: isShowSplash,
  };
};

const changeIsPlayErrorSound = (isPlayErrorSound: boolean): AppActionType<APP_TYPE> => {
  return {
    type: APP_TYPE.CHANGE_IS_PLAY_ERROR_SOUND,
    payload: isPlayErrorSound,
  };
};

const changeIsPlayCorrectSound = (isPlayCorrectSound: boolean): AppActionType<APP_TYPE> => {
  return {
    type: APP_TYPE.CHANGE_IS_PLAY_CORRECT_SOUND,
    payload: isPlayCorrectSound,
  };
};

const AppActions = {
  startLoading,
  endLoading,
  changeIsShowSplash,
  changeIsPlayErrorSound,
  changeIsPlayCorrectSound,
};
export default AppActions;
