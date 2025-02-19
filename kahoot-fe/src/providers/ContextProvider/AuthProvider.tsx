/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppActionType } from "@/interfaces/appTypes";
import { ICurrentUser, IGetTokenDTO } from "@/interfaces/authTypes";
import authServices from "@/services/authServices";
import AuthActions, { AUTH_TYPE } from "@/stores/authStore/authAction";
import AuthReducer, { AuthState, initAuthState } from "@/stores/authStore/authReducer";
import { MezonAppEvent, MezonWebViewEvent } from "@/types/webview";
import { setToLocalStorage } from "@/utils/localStorage";
import React, { Dispatch, createContext, useEffect, useReducer } from "react";

type AuthDispatch = Dispatch<AppActionType<AUTH_TYPE>>;

export const AuthContext = createContext<{ authState: AuthState; authDispatch: AuthDispatch }>({
  authState: initAuthState,
  authDispatch: () => {}, // Provide a default function to avoid TypeScript errors
});

const AuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [authState, authDispatch] = useReducer(AuthReducer, initAuthState);
  useEffect(() => {
    window.Mezon.WebView?.postEvent("PING" as MezonWebViewEvent, { message: "PING" }, () => {
      console.log("PING");
    });
    window.Mezon.WebView?.onEvent("CURRENT_USER_INFO" as MezonAppEvent, async (_, userData: any) => {
      if (!userData || !userData.user) {
        return;
      }
      const getTokenData: IGetTokenDTO = {
        mezonUserId: userData.user?.id,
        email: userData.email,
        userName: userData.user?.username,
        avatar: userData.user?.avatar_url,
      };
      const data = await authServices.getToken(getTokenData);
      if (data.statusCode === 200 || data.statusCode === 201) {
        setToLocalStorage("accessToken", data.data.accessToken);
        const currentUser: ICurrentUser = {
          userId: data.data.userId,
          mezonUserId: getTokenData.mezonUserId,
          userName: data.data.userName,
          avatar: getTokenData.avatar,
          accessToken: data.data.accessToken,
          email: getTokenData.email,
        };
        authDispatch(AuthActions.changeCurrentUser(currentUser));
      }
    });

    return () => {
      window.Mezon.WebView?.offEvent("CURRENT_USER_INFO" as MezonAppEvent, () => {});
    };
  }, []);

  return <AuthContext.Provider value={{ authState, authDispatch }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
