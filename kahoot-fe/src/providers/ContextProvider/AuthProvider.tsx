import { AppActionType } from "@/interfaces/appTypes";
import { ICurrentUser, IGetTokenDTO } from "@/interfaces/authTypes";
import authServices from "@/services/authServices";
import AuthActions, { AUTH_TYPE } from "@/stores/authStore/authAction";
import AuthReducer, { AuthState, initAuthState } from "@/stores/authStore/authReducer";
import { setToLocalStorage } from "@/utils/localStorage";
import { HttpStatusCode } from "axios";
import { Base64 } from "js-base64";
import React, { Dispatch, createContext, useEffect, useReducer } from "react";
import { useSearchParams } from "react-router-dom";

type AuthDispatch = Dispatch<AppActionType<AUTH_TYPE>>;

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<{ authState: AuthState; authDispatch: AuthDispatch }>({
  authState: initAuthState,
  authDispatch: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [authState, authDispatch] = useReducer(AuthReducer, initAuthState);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const miniAppData = searchParams.get("data");
    if (!miniAppData) {
      return;
    } 

    const fetchUserToken = async () => {
      const getTokenData: IGetTokenDTO = {
        hashData: Base64.encode(miniAppData),
      };
      const data = await authServices.getToken(getTokenData);

      if (data?.statusCode === HttpStatusCode.Ok || data?.statusCode === HttpStatusCode.Created) {
        setToLocalStorage("accessToken", data.data.accessToken);
        const currentUser: ICurrentUser = {
          userId: data.data.userId,
          mezonUserId: data.data?.mezonUserId,
          userName: data.data.userName,
          avatar: data.data?.avatar,
          accessToken: data.data.accessToken,
          email: data.data?.email,
        };
        authDispatch(AuthActions.changeCurrentUser(currentUser));
      }
    };
    fetchUserToken();
  }, [searchParams]);

  return <AuthContext.Provider value={{ authState, authDispatch }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
