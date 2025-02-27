import { AnswerColors } from "@/constants/AnswerColors";
import { IQuestionGame } from "@/interfaces/questionTypes";

interface QuestionResultProps {
  correctAnswer: number;
  question?: IQuestionGame;
}
const QuestionResult = ({ correctAnswer, question }: QuestionResultProps) => {
  return (
    <>
      <div className='font-diablo mt-5 min-h-[120px] bg-[#ccccccb5] text-white w-full rounded-xl flex items-center justify-center p-2 select-none cursor-pointer'>
        <p>{question?.title ?? ""}</p>
      </div>

      <div className='grid grid-cols-2 gap-4 mt-6 w-full'>
        {question?.answerOptions.options?.map((option, index) => (
          <div
            key={index}
            style={{ backgroundColor: AnswerColors[index], animationDuration: "0.5s" }}
            className={`relative flex items-center justify-center rounded-xl min-h-[70px] p-2 transition-all filter hover:brightness-110 select-none ${
              correctAnswer === index && "animate-pulse"
            }`}
          >
            <span className='absolute left-0 top-0 h-full flex items-center justify-center w-[50px]'>
              <img className='w-[30px]' src={correctAnswer === index ? "/icons/ApproveIcon.png" : "/icons/CloseIcon.png"} />
            </span>
            <p className='pl-[60px] font-diablo select-none line-clamp-3 text-white'>{option}</p>
          </div>
        ))}
      </div>
    </>
  );
};
export default QuestionResult;
