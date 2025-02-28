import { AppActionType } from "@/interfaces/appTypes";
import { ICurrentUser } from "@/interfaces/authTypes";

export enum AUTH_TYPE {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
  CHANGE_CURRENT_USER = "CHANGE_CURRENT_USER",
}

const login = (): AppActionType<AUTH_TYPE> => {
  return {
    type: AUTH_TYPE.LOGIN,
    payload: null,
  };
};

const register = (): AppActionType<AUTH_TYPE> => {
  return {
    type: AUTH_TYPE.REGISTER,
    payload: null,
  };
};

const changeCurrentUser = (currentUser: ICurrentUser): AppActionType<AUTH_TYPE> => {
  return {
    type: AUTH_TYPE.CHANGE_CURRENT_USER,
    payload: currentUser,
  };
};

const AuthActions = {
  login,
  register,
  changeCurrentUser,
};
export default AuthActions;
