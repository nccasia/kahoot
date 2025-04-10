import Button from "@/components/Button";
import Input from "@/components/Input";
import { EQuestionTypes } from "@/constants/QuestionTypes";
import { IQuestionGame } from "@/interfaces/questionTypes";
import { RoomContext } from "@/providers/ContextProvider/RoomProvider";
import RoomActions from "@/stores/roomStore/roomAction";
import { useContext } from "react";

interface QuestionBoxProps {
  question?: IQuestionGame;
  onSendAnswer: (questionId: string) => void;
  isSubmitAnswer?: boolean;
  isOwner?: boolean;
  selectedAnswers: number[];
  correctAnswers: number[];
  correctAnswerText?: string;
  isShowAnswer: boolean;
}
const answerColor = ["#6f9366c4", "#ef5184c4", "#d451efc4", "#a78910b8"];
const submitLabel = {
  [EQuestionTypes.SINGLE_CHOICE]: (
    <span>
      Bạn hãy chọn <span className='text-[#a50909]'>một đáp án</span> cho câu hỏi này!
    </span>
  ),
  [EQuestionTypes.MULTIPLE_CHOICE]: (
    <span>
      Bạn có thể chọn <span className='text-[#a50909]'>nhiều đáp án</span> cho câu hỏi này!
    </span>
  ),
  [EQuestionTypes.TEXT]: (
    <span>
      <span className='text-[#a50909]'>Nhập đáp án</span> và nhấn submit để trả lời!
    </span>
  ),
};
const QuestionBox = ({
  question,
  onSendAnswer,
  isSubmitAnswer = false,
  isOwner = false,
  selectedAnswers,
  correctAnswers,
  correctAnswerText,
  isShowAnswer = false,
}: QuestionBoxProps) => {
  const { roomDispatch, roomState } = useContext(RoomContext);
  const handleClickAnswer = (index: number) => {
    if (question?.mode === EQuestionTypes.MULTIPLE_CHOICE) {
      roomDispatch(RoomActions.toogleMultipleChoiceSelectedAnswer(index));
    } else if (question?.mode === EQuestionTypes.SINGLE_CHOICE) {
      roomDispatch(RoomActions.changeMultipleChoiceSelectedAnswers([index]));
    }
  };

  const handleChangeAnswerText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    roomDispatch(RoomActions.changeTextAnswer(value));
  };

  return (
    <div className='p-4 mt-2 flex flex-col gap-4 w-full h-full font-coiny'>
      {question?.order && <div className='p-2 font-coiny text-center text-white'>QUESTION {question?.order}</div>}
      {question?.title && (
        <div className=' flex-1 flex-col flex items-center justify-center text-xl bg-[#5d017e] text-white w-full rounded-xl p-2 select-none '>
          <div className='flex flex-col gap-2 items-center justify-center w-full'>
            <p>{question?.title}</p>
          </div>
          {question?.image && (
            <div className='flex-1 max-w-full max-h-[250px]'>
              <img src={question.image} className=' object-contain rounded-md mb-1 w-full h-full' />
            </div>
          )}
        </div>
      )}
      {!isOwner && (
        <div onClick={() => onSendAnswer(question?.id ?? "")} className='flex items-center justify-between w-full'>
          <span>{question?.mode && submitLabel[question?.mode as EQuestionTypes]}</span>
          <Button className='bg-[#6B00E7] rounded-md min-w-[50px]'>Submit</Button>
        </div>
      )}
      {question?.mode === EQuestionTypes.TEXT ? (
        <div className='flex justify-center flex-col items-center gap-4 w-full min-h-[40%] bg-[#4c7e01ad] rounded-lg '>
          <Input
            disabled={isSubmitAnswer || isOwner}
            onChange={handleChangeAnswerText}
            value={roomState?.textAnswer}
            placeholder='Nhập đáp án của bạn'
            className='h-[50px] max-w-[300px] w-full text-center'
          />
          {isSubmitAnswer && isShowAnswer && (
            <div className='flex justify-center items-center gap-2 text-white text-lg'>
              <span>Đáp án đúng:</span>
              <span>{correctAnswerText}</span>
            </div>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-2 gap-4  w-full min-h-[50%]'>
          {question?.answerOptions?.options?.map((option, index) => (
            <Button
              onClick={() => handleClickAnswer(index)}
              key={index}
              style={{
                animationDuration: ".5s",
                backgroundColor: answerColor[index],
              }}
              size='large'
              disabled={isSubmitAnswer || isOwner}
              className={`relative flex items-center justify-center rounded-xl min-h-[130px] max-h-[200px] p-2 transition-all filter  text-white text-xl 
               ${
                 !isSubmitAnswer && !isOwner
                   ? "hover:brightness-110 active:brightness-100 select-none cursor-pointer"
                   : "hover:brightness-100 active:brightness-100 cursor-default"
               } ${
                isSubmitAnswer
                  ? selectedAnswers?.includes(index)
                    ? "brightness-50 hover:brightness-50 active:brightness-50"
                    : ""
                  : ""
              } ${correctAnswers?.includes(index) && "animate-pulse duration-200"}`}
            >
              {!isOwner && (
                <div
                  className={`w-5 h-5 border-white border-2 rounded-full flex items-center justify-center absolute top-2 left-2`}
                >
                  {roomState.multipleChoiceSelectedAnswers?.includes(index) && (
                    <span className='w-2 h-2 bg-white rounded-full block blur-[1px]'></span>
                  )}
                </div>
              )}
              <p>{option}</p>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
export default QuestionBox;
