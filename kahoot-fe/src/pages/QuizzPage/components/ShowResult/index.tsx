import { RoomContext } from "@/providers/ContextProvider/RoomProvider";
import { useContext } from "react";
import QuestionAnalyst from "./QuestionAnalyst";
import QuestionResult from "./QuestionResult";
import ScoreRank from "./ScoreRank";

const ShowResult = () => {
  const { roomState } = useContext(RoomContext);
  return (
    <div
      className='backdrop-blur-md loading-overlay fixed z-50 top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-40 fadeIn'
      style={{ animationDelay: "unset", animationDuration: "0.3s" }}
    >
      <div className='max-w-[1200px] w-[100%] h-full p-2'>
        <div
          style={{ animationDelay: "unset" }}
          className='p-4 flex justify-center flex-col items-center h-[calc(100%-40px)] mt-[20px] shadow-xl rounded-[40px] overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent'
        >
          <div className='flex w-full h-full'>
            <div className='w-1/3 border-r-2 border-white p-2 flex justify-center flex-col items-center'>
              <ScoreRank userRanks={roomState.userRanking} />
            </div>
            <div className='w-2/3 p-2 flex justify-center flex-col items-center'>
              <QuestionAnalyst
                correctAnswer={roomState.correctAnswerOfCurrentQuestion}
                questionAnalyst={roomState.listQuestionAnalyst}
              />
              <QuestionResult question={roomState.currentQuestion} correctAnswer={roomState.correctAnswerOfCurrentQuestion} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ShowResult;
