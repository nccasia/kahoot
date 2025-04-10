import Button from "@/components/Button";
import Collapse from "@/components/Collapse";
import Input from "@/components/Input";
import SelectDropdown from "@/components/SelectDropdown";
import { EQuestionTypes, questionTypeOptions } from "@/constants/QuestionTypes";
import timeOptions from "@/constants/TimeOptions";
import { IQuestion } from "@/interfaces/questionTypes";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import GameActions from "@/stores/gameStore/gameAction";
import { useCallback, useContext, useRef, useState } from "react";

interface IQuestionItemProps {
  question: IQuestion;
  index?: number;
  handleUpdateQuestion?: (question: IQuestion) => void;
  handleDeleteQuestion?: (questionId: string) => void;
  isShowDeleteButton?: boolean;
}

const QuestionContent = ({ question, handleUpdateQuestion, handleDeleteQuestion, isShowDeleteButton }: IQuestionItemProps) => {
  const [textValue, setTextValue] = useState<string>("");
  console.log("question", question);
  const handleFocus = (field: string | number) => {
    if (typeof field === "string") {
      setTextValue(question[field as keyof IQuestion] as string);
    } else {
      setTextValue(question.answerOptions?.options[field]);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  };
  const checkQuestionData = (question: IQuestion) => {
    const checkAnswerOptions =
      question.mode !== EQuestionTypes.TEXT
        ? question.answerOptions.options.every((option) => option && option.trim() !== "")
        : true;

    const checkAnswerIndexes =
      question.mode === EQuestionTypes.MULTIPLE_CHOICE
        ? question.answerOptions.correctIndexes && question.answerOptions.correctIndexes.length > 0
        : true;

    const checkTitle = question.title && question.title.trim() !== "";

    const checkAnswerText =
      question.mode === EQuestionTypes.TEXT.toString() ? question?.answerText && question.answerText?.trim() !== "" : true;

    const checkCorrectIndex =
      question.mode === EQuestionTypes.SINGLE_CHOICE
        ? question.answerOptions.correctIndex !== null && question.answerOptions.correctIndex >= 0
        : true;


    return checkAnswerOptions && checkAnswerText && checkAnswerIndexes && checkTitle && checkCorrectIndex;
  };

  const handleBlur = (field: string | number) => {
    const newQuestion = {
      ...question,
    };
    if (typeof field === "string") {
      newQuestion[field as "title" | "answerText"] = textValue;
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

  const handleToogleCorrectAnswerOfMultipleChoiceQuestion = (index: number) => {
    const newQuestion = {
      ...question,
    };
    if (newQuestion.answerOptions?.correctIndexes) {
      if (newQuestion.answerOptions.correctIndexes?.includes(index)) {
        newQuestion.answerOptions.correctIndexes = newQuestion.answerOptions.correctIndexes.filter((i) => i !== index);
      } else {
        newQuestion.answerOptions.correctIndexes.push(index);
      }
    } else {
      newQuestion.answerOptions.correctIndexes = [index];
    }
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
  const handleChangeQuestionType = (option: { label: string; value: string | number }) => {
    const newQuestion = {
      ...question,
      mode: option.value as string,
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
      URL.revokeObjectURL(question.image);

      const newQuestion = {
        ...question,
        image: undefined,
        imageFile: undefined,
      };

      if (handleUpdateQuestion) handleUpdateQuestion(newQuestion);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Lỗi xóa ảnh:", error);
    }
  };

  return (
    <div className='body p-1 sm:p-2 md:p-4 font-coiny text-white'>
      <div className='flex justify-end mb-3'>
        <div className='max-w-[100px] w-full mr-2'>
          <SelectDropdown
            dropdownPosition='bottom'
            leftIcon={<img className='w-5' src='/icons/icon-clock.png' />}
            selectedValue={question.time}
            options={timeOptions}
            onSelect={handleChangeTime}
          />
        </div>
        <div className='max-w-[250px] w-full'>
          <SelectDropdown
            dropdownPosition='bottom'
            selectedValue={question.mode}
            options={questionTypeOptions}
            onSelect={handleChangeQuestionType}
          />
        </div>
      </div>
      <div className='flex items-center flex-wrap'>
        <span className='inline-block sm:w-[150px] md:w-[200px] w-full text-start text-2xl'>Câu hỏi:</span>
        <div className='flex-1 flex items-center gap-2'>
          <Input
            onFocus={() => handleFocus("title")}
            onBlur={() => handleBlur("title")}
            onChange={handleChange}
            defaultValue={question.title}
            className='flex-1 w-[250px] rounded-lg'
          />
          <span
            onClick={handleAddImage}
            className='ml-0 md:ml-[16px] w-[40px] h-[40px] flex items-center justify-center cursor-pointer hover:bg-green-600 transition-all rounded-full border border-white'
          >
            <img className='w-[25px] h-[25px] filter brightness-0 invert' src='/icons/addimage2.png' alt='Add' />
            <input type='file' accept='image/*' ref={fileInputRef} className='hidden' onChange={handleImageUpload} />
          </span>
        </div>
      </div>
      <div className='relative flex '>
        {question.image && (
          <div className='relative mt-2 ml-0 md:ml-[205px] border-2 border-gray-100 rounded-md p-2'>
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
        {question.mode === EQuestionTypes.TEXT ? (
          <div className='flex items-center flex-wrap gap-1'>
            <span className='inline-block min-w-[195px] text-start text-2xl'>Đáp án :</span>
            <div className='input-box flex-1 min-w-[300px] relative'>
              <Input
                onFocus={() => handleFocus("answerText")}
                onBlur={() => handleBlur("answerText")}
                onChange={handleChange}
                defaultValue={question.answerText}
                className='rounded-lg  w-full '
              />
            </div>
          </div>
        ) : (
          <>
            {question.answerOptions?.options.map((option, index) => (
              <div key={index} className='flex items-center flex-wrap gap-1'>
                <span className='inline-block min-w-[150px] md:min-w-[200px] text-start text-2xl'>Đáp án {index + 1}:</span>
                <div className='flex-1 flex'>
                  <div className='input-box flex-1 min-w-[300px] relative'>
                    {question.mode === EQuestionTypes.SINGLE_CHOICE ? (
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
                    ) : (
                      <div
                        onClick={() => handleToogleCorrectAnswerOfMultipleChoiceQuestion(index)}
                        className='absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 flex w-[40px] rounded-lg h-full bg-[#1C0C8E] items-center justify-center'
                      >
                        <div className='absolute left-0 top-0 z-10 w-full h-full flex items-center justify-center'>
                          <div className={`w-5 h-5 border-white border-2 rounded-sm flex items-center justify-center`}>
                            {question.answerOptions.correctIndexes?.includes(index) && (
                              <span className='w-2 h-2 bg-white rounded-full block blur-[1px]'></span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    <Input
                      onFocus={() => handleFocus(index)}
                      onBlur={() => handleBlur(index)}
                      onChange={handleChange}
                      defaultValue={option}
                      className='rounded-lg w-full pl-11'
                    />
                  </div>
                  <div className='w-[50px] md:w-[60px] flex justify-end items-center'>
                    <span
                      onClick={() => handleDeleteAnswer(index)}
                      className='w-[40px] h-[40px] p-3 flex items-center justify-center bg-[#6B00E7] rounded-md cursor-pointer hover:bg-red-500 transition-all'
                    >
                      <img src='/icons/CloseIcon.png' />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className='flex justify-between mt-4'>
        <div className='ml-0 md:ml-[208px] flex gap-2'>
          <Button onClick={handleAddAnswer} className='bg-[#6B00E7] rounded-md min-w-[50px]'>
            <img className='w-5' src='/icons/PlusIcon.png' />
          </Button>
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
