import { AppActionType } from "@/interfaces/appTypes";
import { GAME_TYPE } from "@/stores/gameStore/gameAction";
import GameReducer, { GameState, initGameState } from "@/stores/gameStore/gameReducer";
import React, { Dispatch, createContext, useReducer } from "react";

type GameDispatch = Dispatch<AppActionType<GAME_TYPE>>;

export const GameContext = createContext<{ gameState: GameState; gameDispatch: GameDispatch }>({
  gameState: initGameState,
  gameDispatch: () => {}, // Provide a default function to avoid TypeScript errors
});

const GameProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  const [gameState, gameDispatch] = useReducer(GameReducer, initGameState);

  return <GameContext.Provider value={{ gameState, gameDispatch }}>{children}</GameContext.Provider>;
};

export default GameProvider;
