import Button from "@/components/Button";
import Input from "@/components/Input";
import { EQuestionTypes } from "@/constants/QuestionTypes";
import { IQuestionGame } from "@/interfaces/questionTypes";
import { RoomContext } from "@/providers/ContextProvider/RoomProvider";
import RoomActions from "@/stores/roomStore/roomAction";
import { useContext } from "react";
import ImagePreview from "../../ShowImage/ImagePreview";

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
    <div className='relative flex flex-wrap items-center justify-center gap-3 text-lg'>
      <span>Bạn hãy chọn</span>
      <span className='text-[#a50909] bg-slate-300 px-2 py-1 rounded-sm'>một đáp án</span>
      <span> cho câu hỏi này!</span>
    </div>
  ),
  [EQuestionTypes.MULTIPLE_CHOICE]: (
    <div className='relative flex flex-wrap items-center justify-center gap-3 text-lg'>
      <span>Bạn có thể chọn</span>
      <span className='text-[#a50909] bg-slate-300 px-2 py-1 rounded-sm'>nhiều đáp án</span>
      <span> cho câu hỏi này!</span>
    </div>
  ),
  [EQuestionTypes.TEXT]: (
    <div className='relative flex flex-wrap items-center justify-center gap-3 text-lg'>
      <span className='text-[#a50909] bg-slate-300 px-2 py-1 rounded-sm'>Nhập đáp án</span>
      <span> Và nhấn submit để trả lời!</span>
    </div>
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
    <div className='p-2 md:p-4 flex flex-col gap-4 w-full h-full font-coiny'>
      {question?.order && <div className='p-2 font-coiny text-center text-white'>QUESTION {question?.order}</div>}
      {question?.title && (
        <div className=' flex-1 flex-col flex items-center justify-center text-xl bg-[#5d017e] text-white w-full rounded-xl p-2 select-none '>
          <div className='flex flex-col gap-2 items-center justify-center w-full'>
            <p>{question?.title}</p>
          </div>
          {question?.image && (
            <div className='w-full max-h-[250px] overflow-hidden rounded-xl flex justify-center items-center'>
              <ImagePreview
                src={question.image}
                classNameDefault="
              max-h-full max-w-full
              object-contain
              rounded-md cursor-pointer
              mx-auto
            "
                classNameZoom="w-[90vw] max-w-[700px] h-auto max-h-[90vh] object-contain p-4"
              />
            </div>
          )}

        </div>
      )}
      {!isOwner && (
        <div className='flex flex-col sm:flex-row items-center justify-between w-full'>
          <span>{question?.mode && submitLabel[question?.mode as EQuestionTypes]}</span>
          <Button onClick={() => onSendAnswer(question?.id ?? "")} className='bg-[#6B00E7] rounded-md min-w-[50px] mt-3'>
            Submit
          </Button>
        </div>
      )}
      {question?.mode === EQuestionTypes.TEXT ? (
        <div className='flex mb-10 justify-center flex-col items-center gap-4 w-full min-h-[40%] bg-[#4c7e01ad] rounded-lg '>
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
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full min-h-[50%]'>
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
               ${!isSubmitAnswer && !isOwner
                  ? "hover:brightness-110 active:brightness-100 select-none cursor-pointer"
                  : "hover:brightness-100 active:brightness-100 cursor-default"
                } ${isSubmitAnswer
                  ? selectedAnswers?.includes(index)
                    ? "brightness-50 hover:brightness-50 active:brightness-50"
                    : ""
                  : ""
                } ${correctAnswers?.includes(index) && "animate-pulse duration-200"}`}
            >
              {!isOwner && (
                <div
                  className={`w-5 h-5 border-white border-2 flex items-center justify-center absolute top-2 left-2 ${question.mode === EQuestionTypes.SINGLE_CHOICE ? "rounded-full" : "rounded-md"
                    }`}
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
