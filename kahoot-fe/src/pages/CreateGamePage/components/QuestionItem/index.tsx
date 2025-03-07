import Button from "@/components/Button";
import Collapse from "@/components/Collapse";
import Input from "@/components/Input";
import { IQuestion } from "@/interfaces/questionTypes";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import GameActions from "@/stores/gameStore/gameAction";
import { useCallback, useContext, useState } from "react";

interface IQuestionItemProps {
  question: IQuestion;
  index?: number;
  handleUpdateQuestion?: (question: IQuestion) => void;
  handleDeleteQuestion?: (questionId: string) => void;
  isShowDeleteButton?: boolean;
}
const QuestionContent = ({ question, handleUpdateQuestion, handleDeleteQuestion, isShowDeleteButton }: IQuestionItemProps) => {
  const [textValue, setTextValue] = useState<string>("");

  const handleFocus = (field: string | number) => {
    if (typeof field === "string") {
      setTextValue(question.title);
    } else {
      setTextValue(question.answerOptions?.options[field]);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };
  const checkQuestionData = (question: IQuestion) => {
    const checkAnswerOptions = question.answerOptions.options.every((option) => option && option.trim() !== "");
    const checkTitle = question.title && question.title.trim() !== "";
    const checkCorrectIndex = question.answerOptions.correctIndex !== null && question.answerOptions.correctIndex >= 0;
    return checkAnswerOptions && checkTitle && checkCorrectIndex;
  };
  const handleBlur = (field: string | number) => {
    const newQuestion = {
      ...question,
    };
    if (typeof field === "string") {
      newQuestion.title = textValue;
    } else {
      newQuestion.answerOptions.options[field] = textValue;
    }
    if (question.isError) {
      newQuestion.isError = !checkQuestionData(newQuestion);
    }
    if (handleUpdateQuestion) handleUpdateQuestion(newQuestion);
  };
  const handleChangeCorrectAnswer = (index: number) => {
    const newQuestion = {
      ...question,
    };
    newQuestion.answerOptions.correctIndex = index;
    if (question.isError) {
      newQuestion.isError = !checkQuestionData(newQuestion);
    }
    if (handleUpdateQuestion) handleUpdateQuestion(newQuestion);
  };

  const deleteQuestion = () => {
    handleDeleteQuestion?.(question.id ?? "");
  };
  return (
    <div className='body p-4 font-diablo text-white'>
      <div className='flex items-center flex-wrap'>
        <span className='inline-block min-w-[200px] text-start text-2xl'>Câu hỏi:</span>
        <Input
          onFocus={() => handleFocus("title")}
          onBlur={() => handleBlur("title")}
          onChange={handleChange}
          defaultValue={question.title}
          className='flex-1 rounded-lg'
        />
      </div>
      <div className='flex flex-col gap-3 mt-2 pt-2 border-t-2 border-gray-100'>
        {question.answerOptions?.options.map((option, index) => (
          <div key={index} className='flex items-center flex-wrap gap-1'>
            <span className='inline-block min-w-[200px] text-start text-2xl'>Đáp án {index + 1}:</span>
            <div className='input-box flex-1 min-w-[300px] relative'>
              <div
                onClick={() => handleChangeCorrectAnswer(index)}
                className='absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 flex w-[40px] rounded-lg h-full bg-[#1C0C8E] items-center justify-center'
              >
                {/* <input
                  tabIndex={-1}
                  hidden
                  checked={question.answerOptions.correctIndex === index}
                  type='radio'
                  className='select-none w-5 h-5 text-blue-600 border-red-900 bg-white focus:border-white'
                /> */}
                <div className='absolute left-0 top-0 z-10 w-full h-full flex items-center justify-center'>
                  <div className={`w-5 h-5 border-white border-2 rounded-full flex items-center justify-center`}>
                    {question.answerOptions.correctIndex === index && (
                      <span className='w-2 h-2 bg-white rounded-full block blur-[1px]'></span>
                    )}
                  </div>
                </div>
              </div>
              <Input
                onFocus={() => handleFocus(index)}
                onBlur={() => handleBlur(index)}
                onChange={handleChange}
                defaultValue={option}
                className='rounded-lg w-full pl-11'
              />
            </div>
          </div>
        ))}
      </div>
      {isShowDeleteButton && (
        <div className='flex justify-end mt-4'>
          <Button onClick={deleteQuestion} className='bg-red-500'>
            Xóa
          </Button>
        </div>
      )}
    </div>
  );
};

const QuestionItem = ({ question, index, isShowDeleteButton }: IQuestionItemProps) => {
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
  const handleDeleteQuestion = useCallback(
    (questionId: string) => {
      gameDispatch(GameActions.deleteQuestion(questionId));
    },
    [gameDispatch]
  );
  return (
    <div className='select-none'>
      <Collapse
        hasError={question.isError}
        changeCollapse={handleChangeCollapse}
        open={question.id === gameState.selectedQuestion?.id}
        content={
          <QuestionContent
            isShowDeleteButton={isShowDeleteButton}
            handleDeleteQuestion={handleDeleteQuestion}
            handleUpdateQuestion={handleUpdateQuestion}
            question={question}
          />
        }
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
