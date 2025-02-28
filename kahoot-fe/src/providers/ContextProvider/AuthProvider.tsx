import { AppActionType } from "@/interfaces/appTypes";
import { ICurrentUser, IGetTokenDTO, IMezonUser, IUserHashInfo } from "@/interfaces/authTypes";
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
  const [mezonUser, setMezonUser] = React.useState<IMezonUser | null>(null);
  const [userHashInfo, setUserHashInfo] = React.useState<IUserHashInfo | null>(null);

  useEffect(() => {
    window.Mezon.WebView?.postEvent("PING" as MezonWebViewEvent, { message: "PING" }, () => {
      console.log("PING");
    });
    window.Mezon.WebView?.postEvent("SEND_BOT_ID" as MezonWebViewEvent, { appId: "1840651530236071936" }, () => {
      console.log("PING");
    });
    window.Mezon.WebView?.onEvent("USER_HASH_INFO" as MezonAppEvent, async (_, userHashData: any) => {
      setUserHashInfo(userHashData.message as IUserHashInfo);
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
    if (!mezonUser || !userHashInfo) {
      return;
    }
    const fetchUserToken = async () => {
      const getTokenData: IGetTokenDTO = {
        mezonUserId: mezonUser.mezon_id,
        email: mezonUser.email,
        userName: mezonUser.user.username,
        avatar: mezonUser.user.avatar_url,
        hashKey: userHashInfo.hash,
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
    };
    fetchUserToken();
  }, [mezonUser, userHashInfo]);

  return <AuthContext.Provider value={{ authState, authDispatch }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
