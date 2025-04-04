/* eslint-disable @typescript-eslint/no-explicit-any */
import ENV from "@/constants/Environment";
import { AppActionType } from "@/interfaces/appTypes";
import { ICurrentUser, IGetTokenDTO, IMezonUser } from "@/interfaces/authTypes";
import authServices from "@/services/authServices";
import AuthActions, { AUTH_TYPE } from "@/stores/authStore/authAction";
import AuthReducer, { AuthState, initAuthState } from "@/stores/authStore/authReducer";
import { MezonAppEvent, MezonWebViewEvent } from "@/types/webview";
import { setToLocalStorage } from "@/utils/localStorage";
import { Base64 } from "js-base64";
import React, { Dispatch, createContext, useEffect, useReducer } from "react";

type AuthDispatch = Dispatch<AppActionType<AUTH_TYPE>>;

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<{ authState: AuthState; authDispatch: AuthDispatch }>({
  authState: initAuthState,
  authDispatch: () => {}, // Provide a default function to avoid TypeScript errors
});

const AuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [authState, authDispatch] = useReducer(AuthReducer, initAuthState);
  const [mezonUser, setMezonUser] = React.useState<IMezonUser | null>(null);
  const [userHashData, setUserHashData] = React.useState<string | null>(null);

  useEffect(() => {
    window.Mezon.WebView?.postEvent("PING" as MezonWebViewEvent, { message: "PING" }, () => {});
    window.Mezon.WebView?.postEvent("SEND_BOT_ID" as MezonWebViewEvent, { appId: ENV.APP_ID }, () => {});
    window.Mezon.WebView?.onEvent("USER_HASH_INFO" as MezonAppEvent, async (_, data: any) => {
      const mezonEventData: string | null | undefined = data?.message?.web_app_data;
      if (mezonEventData) {
        setUserHashData(Base64.encode(mezonEventData));
      }
    });
    window.Mezon.WebView?.onEvent("CURRENT_USER_INFO" as MezonAppEvent, async (_, userData: any) => {
      if (!userData || !userData.user) {
        return;
      }
      const mezonUser: IMezonUser = {
        email: userData.email,
        mezon_id: userData.mezon_id,
        user: {
          avatar_url: userData.user.avatar_url,
          display_name: userData.user.display_name,
          id: userData.user.id,
          username: userData.user.username,
        },
        wallet: userData.wallet,
      };
      setMezonUser(mezonUser);
    });

    return () => {
      window.Mezon.WebView?.offEvent("CURRENT_USER_INFO" as MezonAppEvent, () => {});
      window.Mezon.WebView?.offEvent("USER_HASH_INFO" as MezonAppEvent, () => {});
    };
  }, []);

  useEffect(() => {
    if (!mezonUser || !userHashData) {
      return;
    }
    const fetchUserToken = async () => {
      const getTokenData: IGetTokenDTO = {
        hashData: userHashData,
      };
      const data = await authServices.getToken(getTokenData);
      if (data.statusCode === 200 || data.statusCode === 201) {
        setToLocalStorage("accessToken", data.data.accessToken);
        const currentUser: ICurrentUser = {
          userId: data.data.userId,
          mezonUserId: mezonUser.user.id,
          userName: data.data.userName,
          avatar: mezonUser.user.avatar_url,
          accessToken: data.data.accessToken,
          email: data.data.email ?? mezonUser.email,
        };
        authDispatch(AuthActions.changeCurrentUser(currentUser));
      }
    };
    fetchUserToken();
  }, [mezonUser, userHashData]);

  return <AuthContext.Provider value={{ authState, authDispatch }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
