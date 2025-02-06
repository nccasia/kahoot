import { AppActionType } from "@/types/appTypes";
import { AUTH_TYPE } from "./authAction";

export interface AuthState {
  loading: boolean;
  isLogin: boolean;
}

export const initAuthState: AuthState = {
  loading: false,
  isLogin: false,
};

const AuthReducer = (state = initAuthState, action: AppActionType<AUTH_TYPE>): AuthState => {
  switch (action.type) {
    case AUTH_TYPE.LOGIN:
      return {
        ...state,
        isLogin: true,
      };
    case AUTH_TYPE.REGISTER:
      return {
        ...state,
        isLogin: true,
      };
    default:
      return state;
  }
};
export default AuthReducer;
