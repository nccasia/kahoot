import ButtonBack from "@/components/ButtonBack";
import Input from "@/components/Input";
import RoomItem from "./RoomItem";

const SearchGamePage = () => {
  return (
    <div className='max-w-[1200px] w-[100%] h-full p-2'>
      <div className='header h-[80px] flex justify-between items-center'>
        <ButtonBack />
        <Input maxLength={6} placeholder='Nhập Code' className='text-center w-[200px]  placeholder-white' />
      </div>
      <div
        style={{ animationDelay: "unset" }}
        className='fadeIn h-[calc(100%-100px)] mt-[20px] bg-[#6B00E7CC] border-[0.6rem] border-[#1C0C8E] rounded-[40px] overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent'
      >
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
          {Array.from({ length: 10 }).map((_, index) => (
            <RoomItem key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default SearchGamePage;
