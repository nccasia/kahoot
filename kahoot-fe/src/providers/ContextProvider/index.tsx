import React from "react";
import AppProvider from "./AppProvider";
import AuthProvider from "./AuthProvider";
import GameProvider from "./GameProvider";
import RoomProvider from "./RoomProvider";

const ContextProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
    <AppProvider>
      <AuthProvider>
        <GameProvider>
          <RoomProvider>
            {/* Add more context provider here */}
            {children}
          </RoomProvider>
        </GameProvider>
      </AuthProvider>
    </AppProvider>
  );
};

export default ContextProvider;
