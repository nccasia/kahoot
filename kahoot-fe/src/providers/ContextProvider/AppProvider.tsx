import React, { Dispatch, createContext, useReducer } from "react";
import AppReducer, { AppState, initAppState } from "../../stores/appStore/app.reducer";
import { APP_TYPE } from "../../stores/appStore/app.action";
import { AppActionType } from "../../types/appTypes";

type AppDispatch = Dispatch<AppActionType<APP_TYPE>>;

export const AppContext = createContext<{ appState: AppState; appDispatch: AppDispatch }>({
  appState: initAppState,
  appDispatch: () => {}, // Provide a default function to avoid TypeScript errors
});

const AppProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [appState, appDispatch] = useReducer(AppReducer, initAppState);

  return <AppContext.Provider value={{ appState, appDispatch }}>{children}</AppContext.Provider>;
};

export default AppProvider;
