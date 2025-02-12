/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppActionType } from "@/interfaces/appTypes";
import { IGetTokenDTO } from "@/interfaces/authTypes";
import authServices from "@/services/authServices";
import { AUTH_TYPE } from "@/stores/authStore/authAction";
import AuthReducer, { AuthState, initAuthState } from "@/stores/authStore/authReducer";
import { MezonAppEvent, MezonWebViewEvent } from "@/types/webview";
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
      console.log(getTokenData);
      // Dispatch the action to update the state
      const data = await authServices.getToken(getTokenData);
      console.log(data);
    });
  }, []);

  return <AuthContext.Provider value={{ authState, authDispatch }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
