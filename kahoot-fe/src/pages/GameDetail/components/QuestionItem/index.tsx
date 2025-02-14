import Collapse from "@/components/Collapse";
import { IQuestion } from "@/interfaces/questionTypes";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import GameActions from "@/stores/gameStore/gameAction";
import { useCallback, useContext } from "react";

interface IQuestionItemProps {
  question: IQuestion;
  index?: number;
  handleUpdateQuestion?: (question: IQuestion) => void;
}
const QuestionContent = ({ question }: IQuestionItemProps) => {
  return (
    <div className='body p-4 font-diablo text-white'>
      <div className='flex flex-col gap-3'>
        {question.answerOptions?.options.map((option, index) => (
          <div key={index} className='flex items-center flex-wrap gap-2 min-h-[30px]'>
            <span className='w-[50px] inline-block'>{index + 1}.</span>
            <span className='flex-1 text-start'>{option}</span>
            <span className='w-[50px] inline-block'>
              {question.answerOptions?.correctIndex === index && <img className='w-[25px]' src='/icons/icon-checked.png' />}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuestionItem = ({ question, index }: IQuestionItemProps) => {
  const { gameState, gameDispatch } = useContext(GameContext);
  const handleUpdateQuestion = useCallback(
    (question: IQuestion) => {
      gameDispatch(GameActions.changeQuestionValue(question));
    },
    [gameDispatch]
  );
  const handleChangeCollapse = (isOpen: boolean) => {
    if (isOpen) {
      gameDispatch(GameActions.changeSelectedQuestion(question.id ?? ""));
    }
  };
  return (
    <div className='select-none'>
      <Collapse
        hasError={question.isError}
        changeCollapse={handleChangeCollapse}
        open={question.id === gameState.selectedQuestion?.id}
        content={<QuestionContent handleUpdateQuestion={handleUpdateQuestion} question={question} />}
      >
        <div className='font-diablo text-start text-white line-clamp-2 min-h-[50px]'>
          <span className='mr-2'>Câu {index}:</span>
          <span>{question.title}</span>
        </div>
      </Collapse>
    </div>
  );
};
export default QuestionItem;
