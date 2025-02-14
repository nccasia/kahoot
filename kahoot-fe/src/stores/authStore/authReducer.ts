import { AppActionType } from "@/interfaces/appTypes";
import { ICurrentUser } from "@/interfaces/authTypes";
import { AUTH_TYPE } from "./authAction";

export interface AuthState {
  loading: boolean;
  currentUser?: ICurrentUser;
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
    case AUTH_TYPE.CHANGE_CURRENT_USER:
      return {
        ...state,
        currentUser: action.payload,
      };
    default:
      return state;
  }
};
export default AuthReducer;
