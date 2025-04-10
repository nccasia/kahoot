import { IQuestionGame, ITextQuestionAnalyst } from "@/interfaces/questionTypes";

interface ITextQuestionAnalystProps {
  currentQuestion: IQuestionGame;
  questionAnalyst: ITextQuestionAnalyst[];
  correctAnswers: string;
}
const TextQuestionAnalyst = ({ currentQuestion, questionAnalyst, correctAnswers }: ITextQuestionAnalystProps) => {
  console.log("TextQuestionAnalyst", questionAnalyst);
  console.log("currentQuestion", currentQuestion);
  console.log("correctAnswers", correctAnswers);
  return (
    <div className='p-2 w-full h-full'>
      <div
        className=' w-full font-coiny h-[calc(100%)] overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent'
        style={{ borderRadius: "10px" }}
      >
        {currentQuestion?.order && (
          <div
            className='p-2 font-coiny text-center text-white bg-[#5d017e] min-h-[50px] flex items-center justify-center'
            style={{ borderTopLeftRadius: "10px", borderTopRightRadius: "10px" }}
          >
            QUESTION {currentQuestion?.order}
          </div>
        )}
        {currentQuestion?.title && (
          <div className=' flex-1 mt-2 flex-col flex items-center justify-center text-xl bg-[#5d017e] text-white w-full  p-2 select-none min-h-[100px]'>
            <div className='flex flex-col gap-2 items-center justify-center w-full'>
              <p>{currentQuestion?.title}</p>
            </div>
            {!currentQuestion?.image && (
              <div className='flex-1 max-w-full max-h-[250px] mt-2'>
                <img
                  src={
                    currentQuestion.image ??
                    "https://lh3.googleusercontent.com/a/ACg8ocJduYVhAsn-8xVn5lnfwoB1rM8URHqmncDjZvSD3FdhN3Oenw=s96-c"
                  }
                  className=' object-contain rounded-md mb-1 w-full h-full'
                />
              </div>
            )}
            <div className='flex items-center justify-center gap-2 text-white text-lg mt-5'>
              <span>Đáp án đúng:</span>
              <span>{correctAnswers}</span>
            </div>
          </div>
        )}
        <div className='bg-[#5d017e] w-full p-2 mt-2' style={{ borderBottomLeftRadius: "10px", borderBottomRightRadius: "10px" }}>
          <div className='bg-[#5d017e] sticky -top-1 z-11 h-[50px] flex items-center justify-center text-white font-coiny'>
            <span className=' p-2 border-b-2 border-white '>Đáp án đã gửi lên</span>
          </div>
          <div className='min-h-[200px] mt-2'>
            <div className='bg-[#5d017e] sticky z-10 top-[45px] flex items-center justify-between w-full min-h-[50px]'>
              <div className='flex-1'>
                <span className=' p-1 border-b-[1px] border-white'>Đáp án</span>
              </div>
              <div className='flex-1'>
                <span className=' p-1 border-b-[1px] border-white'>Số lượng</span>
              </div>
            </div>
            {questionAnalyst.map((analyst, index) => (
              <div key={index} className='flex items-center justify-between w-full min-h-[40px] mb-2'>
                <div className='flex-1'>
                  <span>{analyst.answerText} </span>
                </div>
                <div className='flex-1'>
                  <span>{analyst.totalMatched}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextQuestionAnalyst;
