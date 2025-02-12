import React from "react";
import AppProvider from "./AppProvider";
import AuthProvider from "./AuthProvider";
import GameProvider from "./GameProvider";

const ContextProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <AppProvider>
      <AuthProvider>
        <GameProvider>
          {/* add other provider hear */}
          {children}
        </GameProvider>
      </AuthProvider>
    </AppProvider>
  );
};

export default ContextProvider;
