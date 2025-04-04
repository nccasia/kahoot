import Button from "@/components/Button";
import { IQuestionGame } from "@/interfaces/questionTypes";

interface QuestionBoxProps {
  question?: IQuestionGame;
  onSendAnswer: (questionId: string, answerIndex: number) => void;
  isSubmitAnswer?: boolean;
  isOwner?: boolean;
  selectedAnswer?: number;
  correctAnswer?: number;
}
const answerColor = ["#6f9366c4", "#ef5184c4", "#d451efc4", "#a78910b8"];
const QuestionBox = ({
  question,
  onSendAnswer,
  isSubmitAnswer = false,
  isOwner = false,
  selectedAnswer,
  correctAnswer,
}: QuestionBoxProps) => {
  return (
    <div className='p-4 mt-2 flex flex-col gap-4 w-full h-full font-coiny'>
      {question?.order && <div className='p-2 font-coiny text-center text-white'>QUESTION {question?.order}</div>}
      {question?.title && (
        <div className="flex flex-col space-between">
          {question?.image && (
            <img
              src={question.image}
              className='max-w-full  max-h-[350px] object-contain rounded-md mb-1'
            />
          )}
          <div className='min-h-[150px] flex-1 text-xl bg-[#5d017e] text-white w-full rounded-xl flex items-center justify-center p-2 select-none '>

            <p>{question?.title}</p>

          </div>
        </div>

      )}
      <div className='grid grid-cols-2 gap-4 mt-4 w-full min-h-[50%]'>
        {question?.answerOptions?.options?.map((option, index) => (
          <Button
            onClick={() => onSendAnswer(question.id, index)}
            key={index}
            style={{
              animationDuration: ".5s",
              backgroundColor: answerColor[index],
            }}
            size='large'
            disabled={isSubmitAnswer || isOwner}
            className={` flex items-center justify-center rounded-xl min-h-[130px] max-h-[200px] p-2 transition-all filter  text-white text-xl 
               ${!isSubmitAnswer && !isOwner
                ? "hover:brightness-110 active:brightness-100 select-none cursor-pointer"
                : "hover:brightness-100 active:brightness-100 cursor-default"
              } ${isSubmitAnswer ? (selectedAnswer !== index ? "brightness-50 hover:brightness-50 active:brightness-50" : "") : ""
              } ${correctAnswer === index && "animate-pulse duration-200"}`}
          >
            <p>{option}</p>
          </Button>
        ))}
      </div>
    </div>
  );
};
export default QuestionBox;
