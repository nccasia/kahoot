import { GameContext } from "@/providers/ContextProvider/GameProvider";
import GameActions from "@/stores/gameStore/gameAction";
import { useContext } from "react";

const ChangeQuestionBox = () => {
  const { gameState, gameDispatch } = useContext(GameContext);
  const handleChangeQuestion = (direction: "next" | "prev") => {
    let newIndex = gameState.selectedQuestionIndex;
    if (direction === "next") {
      newIndex += 1;
      if (newIndex >= gameState.listQuestions.length) newIndex = 0;
    } else {
      newIndex -= 1;
      if (newIndex < 0) newIndex = gameState.listQuestions.length - 1;
    }
    gameDispatch(GameActions.changeSelectedQuestionIndex(newIndex));
  };
  return (
    <div className=' mb-3 h-[50px] flex justify-center items-center bottom-5 left-0 z-10'>
      <div className='w-[230px] h-[50px] bg-[#6bb3e0] shadow-lg rounded-md flex items-center justify-center'>
        <div
          onClick={() => handleChangeQuestion("prev")}
          className='w-[50px] h-[50px] flex justify-center items-center border-r-[1px] border-[#fff] cursor-pointer bg-[#6bb3e0] hover:brightness-90 active:brightness-100 transition-all'
          style={{ borderTopLeftRadius: "8px", borderBottomLeftRadius: "8px" }}
        >
          <img className='w-[25px] rotate-180' src='/icons/PlayIcon.png' alt='' />
        </div>
        <div className='flex-1'>
          <span className='font-coiny text-lg'>Question {gameState.selectedQuestionIndex + 1}</span>
        </div>
        <div
          onClick={() => handleChangeQuestion("next")}
          className='w-[50px] h-[50px] flex justify-center items-center border-l-[1px] border-[#fff] cursor-pointer bg-[#6bb3e0] hover:brightness-90 active:brightness-100 transition-all'
          style={{ borderTopRightRadius: "8px", borderBottomRightRadius: "8px" }}
        >
          <img className='w-[25px]' src='/icons/PlayIcon.png' alt='' />
        </div>
      </div>
    </div>
  );
};

export default ChangeQuestionBox;
