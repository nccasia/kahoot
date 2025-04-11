import { IQuestionGame } from "@/interfaces/questionTypes";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import { RoomContext } from "@/providers/ContextProvider/RoomProvider";
import gameServices from "@/services/gameServices";
import questionServices from "@/services/questionServices";
import GameActions from "@/stores/gameStore/gameAction";
import RoomActions from "@/stores/roomStore/roomAction";
import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfoBox from "./components/InfoBox";
import QuestionBox from "./components/QuestionBox";

const SimulateGame = () => {
  const { roomState, roomDispatch } = useContext(RoomContext);
  const { gameState, gameDispatch } = useContext(GameContext);
  const { gameId } = useParams();
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
        roomDispatch(RoomActions.changeCurrentQuestion(response.data[0] as IQuestionGame));
      } catch (error) {
        console.log("error", error);
      }
    };
    getGameById();
    getGameQuestions();
  }, [gameDispatch, gameId, roomDispatch]);

  useEffect(() => {
    if (!gameState.selectedQuestionIndex || gameState.listQuestions.length <= 0) return;
    const currentQuestion = gameState.listQuestions[gameState.selectedQuestionIndex];
    roomDispatch(RoomActions.changeCurrentQuestion((currentQuestion ?? gameState.listQuestions[0]) as IQuestionGame));
  }, [gameState.selectedQuestionIndex, gameState.listQuestions, roomDispatch]);

  return (
    <div className='max-w-[1200px] w-[100%] h-full p-2 '>
      <div
        style={{ animationDelay: "unset" }}
        className='relative fadeIn h-[calc(100%-10px)] md:h-[calc(100%-40px)] mt-[5px] md:mt-[20px] bg-[#ba85ff8f] shadow-xl rounded-sm md:rounded-[40px] overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent'
      >
        <div className='flex w-full h-full flex-col md:flex-row'>
          <div className=''>
            <InfoBox />
          </div>
          <div className='flex-1'>
            <QuestionBox
              isShowAnswer={roomState.isShowAnswer}
              correctAnswerText={roomState.correctTextAnswer}
              correctAnswers={roomState.correctAnswerOfCurrentQuestions}
              selectedAnswers={roomState.selectedAnswers}
              isOwner={false}
              isSubmitAnswer={roomState.isSubmitAnswer}
              onSendAnswer={() => {}}
              question={roomState.currentQuestion}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulateGame;
