import { IQuestionGame } from "@/interfaces/questionTypes";

interface QuestionBoxProps {
  question?: IQuestionGame;
  onSendAnswer: (questionId: string, answerIndex: number) => void;
  isSubmitAnswer?: boolean;
}
const answerColor = ["#6f9366c4", "#ef5184c4", "#d451efc4", "#a78910b8"];
const QuestionBox = ({ question, onSendAnswer, isSubmitAnswer = false }: QuestionBoxProps) => {
  return (
    <div className='p-4 mt-2 flex flex-col gap-4 justify-center  w-full h-full font-diablo'>
      {question?.title && (
        <div className='min-h-[200px] bg-[#ccccccb5] w-full rounded-xl flex items-center justify-center p-2 select-none cursor-pointer'>
          <p>{question?.title}</p>
        </div>
      )}
      <div className='grid grid-cols-2 gap-4 mt-4 w-full'>
        {question?.answerOptions?.options?.map((option, index) => (
          <div
            onClick={() => onSendAnswer(question.id, index)}
            key={index}
            style={{ backgroundColor: answerColor[index] }}
            className={`cursor-pointer flex items-center justify-center rounded-xl min-h-[130px] p-2 transition-all ${
              isSubmitAnswer ? "filter hover:brightness-110 active:brightness-100 select-none" : ""
            }`}
          >
            <p>{option}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default QuestionBox;
