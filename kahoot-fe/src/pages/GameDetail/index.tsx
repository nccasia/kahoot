import { GameContext } from "@/providers/ContextProvider/GameProvider";
import gameServices from "@/services/gameServices";
import questionServices from "@/services/questionServices";
import GameActions from "@/stores/gameStore/gameAction";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import GameInfoBox from "./components/GameInfoBox";
import QuestionBox from "./components/QuestionBox";

const GameDetail = () => {
  const { gameId } = useParams();
  const { gameState, gameDispatch } = useContext(GameContext);
  useEffect(() => {
    if (!gameId) return;
    const getGameById = async () => {
      try {
        const response = await gameServices.getGameById(gameId);
        if (response.statusCode !== 200) {
          console.log("error", response);
          return;
        }
        gameDispatch(GameActions.changeSelectedGame(response.data));
      } catch (error) {
        console.log("error", error);
      }
    };
    const getGameQuestions = async () => {
      try {
        const response = await questionServices.getGameQuestion(gameId, 1, 999, "");
        if (response.statusCode !== 200) {
          console.log("error", response);
          return;
        }
        gameDispatch(GameActions.changeListQuestion(response.data));
      } catch (error) {
        console.log("error", error);
      }
    };
    getGameById();
    getGameQuestions();
  }, [gameDispatch, gameId]);
  return (
    <div className='max-w-[1200px] w-[100%] h-full p-2'>
      <div
        style={{ animationDelay: "unset" }}
        className='h-[calc(100%-40px)] bg-[#6b00e78a] flex mt-[20px]  rounded-[40px] overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent fadeIn '
      >
        <GameInfoBox totalQuestion={gameState?.listQuestions.length} gameInfo={gameState.selectedGame} />
        <QuestionBox questions={gameState.listQuestions} />
      </div>
    </div>
  );
};
export default GameDetail;
