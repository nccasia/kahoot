import React from "react";
import AppProvider from "./AppProvider";
import GameProvider from "./GameProvider";
import RoomProvider from "./RoomProvider";

const ContextProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  return (
      <AppProvider>
        <GameProvider>
          <RoomProvider>
            {/* Add more context provider here */}
            {children}
          </RoomProvider>
        </GameProvider>
      </AppProvider>
  );
};

export default ContextProvider;
