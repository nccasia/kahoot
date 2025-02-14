import { IQuestion } from "@/interfaces/questionTypes";
import QuestionItem from "../QuestionItem";

interface QuestionItemProps {
  questions: IQuestion[];
}
const QuestionBox = ({ questions }: QuestionItemProps) => {
  return (
    <div className='flex-1 p-4 flex gap-2 flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent'>
      {questions.map((question, index) => (
        <QuestionItem key={question.id} question={question} index={index + 1} />
      ))}
    </div>
  );
};
export default QuestionBox;
