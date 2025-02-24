import { AnswerColors } from "@/constants/AnswerColors";

interface QuestionResultProps {
  correctAnswer: number;
}
const QuestionResult = ({ correctAnswer }: QuestionResultProps) => {
  return (
    <>
      <div className='font-diablo mt-5 min-h-[120px] bg-[#ccccccb5] w-full rounded-xl flex items-center justify-center p-2 select-none cursor-pointer'>
        <p>akdsfj laksdjfo iqowie aidsfj oiqwe oiajsdf oiqwueoi jasdkfj oqiwej jsdfi</p>
      </div>

      <div className='grid grid-cols-2 gap-4 mt-6 w-full'>
        {[
          "hello",
          "hello",
          "hello",
          "hello aksdjf lajdf lkajsdfl kjodsif jaldsfj oqiwej asdj fioqjwe lkasdjf oqiwej asdjf klqwjeo ijasdflk jasdlfk jo",
        ]?.map((option, index) => (
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
            <p className='pl-[60px] font-diablo select-none line-clamp-3'>{option}</p>
          </div>
        ))}
      </div>
    </>
  );
};
export default QuestionResult;
