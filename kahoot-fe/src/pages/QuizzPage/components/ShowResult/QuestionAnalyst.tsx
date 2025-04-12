import { AnswerColors } from "@/constants/AnswerColors";
import { IQuestionAnalyst } from "@/interfaces/questionTypes";
import { useMemo } from "react";

interface IQuestionAnalystProps {
  questionAnalyst: IQuestionAnalyst[];
  correctAnswers: number[];
}
const QuestionAnalyst = ({ questionAnalyst, correctAnswers }: IQuestionAnalystProps) => {
  const stepHeight = useMemo(() => {
    const getMaxSelected = Math.max(...questionAnalyst.map((analyst) => analyst.totalSeleted));
    return 150 / getMaxSelected;
  }, [questionAnalyst]);
  console.log(questionAnalyst);
  return (
    <div className='flex items-end justify-around w-full h-full max-w-[700px] max-h-[180px] border-b-4 pb-1 border-b-red-500'>
      {questionAnalyst.map((analyst, index) => (
        <div
          className={`font-coiny rounded-sm text-white  ${correctAnswers.includes(index) && "animate-pulse"}`}
          style={{ backgroundColor: AnswerColors[index], animationDuration: "0.5s" }}
          key={index}
        >
          <div
            className='w-[70px] min-h-[10px] max-h-[150px] rounded-sm'
            style={{ height: `${stepHeight * analyst.totalSeleted}px` }}
          ></div>
          <span>{analyst.totalSeleted}</span>
        </div>
      ))}
    </div>
  );
};
export default QuestionAnalyst;
