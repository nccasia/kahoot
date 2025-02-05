import React, { Dispatch, createContext, useReducer } from "react";
import { AUTH_TYPE } from "../../stores/authStore/auth.action";
import { AppActionType } from "../../types/appTypes";
import AuthReducer, { AuthState, initAuthState } from "../../stores/authStore/auth.reducer";

type AuthDispatch = Dispatch<AppActionType<AUTH_TYPE>>;

export const AuthContext = createContext<{ authState: AuthState; authDispatch: AuthDispatch }>({
  authState: initAuthState,
  authDispatch: () => {}, // Provide a default function to avoid TypeScript errors
});

const AuthProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [authState, authDispatch] = useReducer(AuthReducer, initAuthState);

  return <AuthContext.Provider value={{ authState, authDispatch }}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
