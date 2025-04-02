import Button from "@/components/Button";
import Collapse from "@/components/Collapse";
import Input from "@/components/Input";
import SelectDropdown from "@/components/SelectDropdown";
import { IQuestion } from "@/interfaces/questionTypes";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import GameActions from "@/stores/gameStore/gameAction";
import { useCallback, useContext, useRef, useState } from "react";

const timeOptions: Array<{
  label: string;
  value: number;
}> = [
  { label: "15s", value: 15 },
  { label: "30s", value: 30 },
  { label: "45s", value: 45 },
  { label: "60s", value: 60 },
];

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
  const handleChangeTime = (option: { label: string; value: number | string }) => {
    const newQuestion = {
      ...question,
      time: option.value as number,
    };
    if (handleUpdateQuestion) handleUpdateQuestion(newQuestion);
  };

  const deleteQuestion = () => {
    handleDeleteQuestion?.(question.id ?? "");
  };

  const handleDeleteAnswer = (index: number) => {
    if (question.answerOptions.options.length <= 2) return;
    const newQuestion = {
      ...question,
      answerOptions: {
        ...question.answerOptions,
        options: question.answerOptions.options.filter((_, i) => i !== index),
      },
    };
    if (
      newQuestion.answerOptions.correctIndex &&
      newQuestion.answerOptions.correctIndex >= newQuestion.answerOptions.options.length
    ) {
      newQuestion.answerOptions.correctIndex = null;
    }
    if (question.isError) {
      newQuestion.isError = !checkQuestionData(newQuestion);
    }
    if (handleUpdateQuestion) handleUpdateQuestion(newQuestion);
  };

  const handleAddAnswer = () => {
    if (question.answerOptions.options.length >= 4) return;
    const newQuestion = {
      ...question,
      answerOptions: {
        ...question.answerOptions,
        options: [...question.answerOptions.options, ""],
      },
    };
    if (question.isError) {
      newQuestion.isError = !checkQuestionData(newQuestion);
    }
    if (handleUpdateQuestion) handleUpdateQuestion(newQuestion);
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleAddImage = () => {
    fileInputRef.current?.click();
  };
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      try {
        const newQuestion = {
          ...question,
          image: URL.createObjectURL(file),
          imageFile: file,
        };
        if (handleUpdateQuestion) handleUpdateQuestion(newQuestion);
      } catch (error) {
        console.error("Lỗi upload ảnh:", error);
      }
    }
  };

  const handleDeleteImage = async () => {
    if (!question.image) return;

    try {
      const newQuestion = {
        ...question,
        image: undefined,
        imageFile: undefined,
      };
      if (handleUpdateQuestion) handleUpdateQuestion(newQuestion);
    } catch (error) {
      console.error("Lỗi xóa ảnh:", error);
    }
  };

  return (
    <div className='body p-4 font-coiny text-white'>
      <div className='flex items-center flex-wrap'>
        <span className='inline-block min-w-[200px] text-start text-2xl'>Câu hỏi:</span>
        <Input
          onFocus={() => handleFocus("title")}
          onBlur={() => handleBlur("title")}
          onChange={handleChange}
          defaultValue={question.title}
          className='flex-1 rounded-lg'
        />
        <span
          onClick={handleAddImage}
          className='ml-7 w-[40px] h-[40px] flex items-center justify-center cursor-pointer hover:bg-green-500 transition-all rounded-full'
        >
          <img className='w-[40px] h-[40px] filter brightness-0 invert' src='/icons/addimage2.png' alt='Add' />
        </span>

        <input type='file' accept='image/*' ref={fileInputRef} className='hidden' onChange={handleImageUpload} />
      </div>
      <div className='relative flex '>
        {question.image && (
          <div className='relative mt-2 ml-[205px] border-2 border-gray-100 rounded-md p-2'>
            <img src={question.image} className='w-auto h-[150px] object-cover rounded-md' />
            <span
              onClick={handleDeleteImage}
              className='absolute top-[-5px] right-[-5px] w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-red-90 transition-all'
            >
              <img src='/icons/remove.png' />
            </span>
          </div>
        )}
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
            <div className='w-16 flex justify-end items-center'>
              <span
                onClick={() => handleDeleteAnswer(index)}
                className='w-[40px] h-[40px] p-3 flex items-center justify-center bg-[#6B00E7] rounded-md cursor-pointer hover:bg-red-500 transition-all'
              >
                <img src='/icons/CloseIcon.png' />
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className='flex justify-between mt-4'>
        <div className='ml-[208px] flex gap-2'>
          <Button onClick={handleAddAnswer} className='bg-[#6B00E7] rounded-md min-w-[50px]'>
            <img className='w-10' src='/icons/PlusIcon.png' />
          </Button>
          <SelectDropdown selectedValue={question.time} options={timeOptions} onSelect={handleChangeTime} />
        </div>
        {isShowDeleteButton && (
          <>
            <Button onClick={deleteQuestion} className='bg-red-500'>
              Xóa
            </Button>
          </>
        )}
      </div>
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
        <div className='font-coiny text-start text-white line-clamp-2 min-h-[50px]'>
          <span className='mr-2'>Câu {index}:</span>
          <span>{question.title}</span>
        </div>
      </Collapse>
    </div>
  );
};
export default QuestionItem;
