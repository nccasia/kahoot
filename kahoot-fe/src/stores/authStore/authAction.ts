import { AppActionType } from "@/interfaces/appTypes";

export enum AUTH_TYPE {
  LOGIN = "LOGIN",
  REGISTER = "REGISTER",
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

const AuthActions = {
  login,
  register,
};
export default AuthActions;
