import Button from "@/components/Button";
import ButtonBack from "@/components/ButtonBack";
import QuestionItem from "./components/QuestionItem";

const CreateGamePage = () => {
  return (
    <div className='max-w-[1200px] w-[100%] h-full p-2'>
      <div className='header h-[80px] flex justify-between items-center'>
        <ButtonBack />
        {/* <Input maxLength={6} placeholder='Nhập Code' className='text-center w-[200px]  placeholder-white' /> */}
        <Button className='text-center  bg-[#6B00E7] font-diablo'>Thêm câu hỏi</Button>
      </div>
      <div
        style={{ animationDelay: "unset" }}
        className='fadeIn h-[calc(100%-100px)] mt-[20px] flex flex-col gap-3 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent'
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <QuestionItem key={index} />
        ))}
      </div>
    </div>
  );
};
export default CreateGamePage;
