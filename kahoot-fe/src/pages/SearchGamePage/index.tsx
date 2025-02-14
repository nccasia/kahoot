import Button from "@/components/Button";

const SearchGamePage = () => {
  return (
    <div className='w-full flex flex-col items-center justify-center h-screen gap-10 select-none'>
      <div className='flex flex-col items-center gap-4 h-[450px]'>
        <div className={` flex justify-center items-center w-full`}>
          <h1
            style={{ textShadow: "0px 15px #616BDC" }}
            className='font-diablo text-[60px] sm:text-[80px] md:text-[100px] text-white flex items-center justify-center gap-4 sm:gap-6 md:gap-10 flex-wrap'
          >
            <div className='flex gap-1 sm:gap-1 md:gap-2'>
              <span className='text-animation animate-waviy' style={{ animationDelay: `${0 * 0.1}s` }}>
                Đ
              </span>
              <span className='text-animation animate-waviy' style={{ animationDelay: `${1 * 0.1}s` }}>
                Ố
              </span>
            </div>
            <div className='flex gap-1 sm:gap-1 md:gap-2'>
              <span className='text-animation animate-waviy' style={{ animationDelay: `${2 * 0.1}s` }}>
                B
              </span>
              <span className='text-animation animate-waviy' style={{ animationDelay: `${3 * 0.1}s` }}>
                ạ
              </span>
              <span className='text-animation animate-waviy' style={{ animationDelay: `${4 * 0.1}s` }}>
                N
              </span>
            </div>
          </h1>
        </div>
        <div className='w-full max-w-[400px] min-h-[150px] bg-[#ba85ff] rounded-lg flex-col flex items-center justify-center p-4 font-diablo'>
          <input
            type='text'
            placeholder='Nhập mã pin'
            maxLength={6}
            className='w-full text-center text-white placeholder:text-white bg-transparent border-2 border-gray-500 p-2 rounded-lg  focus:border-2 focus-within:bottom-2 focus-visible:border-2 outline-none focus:border-gray-900'
          />
          <Button className='w-full mt-2 bg-[#6BB3E0]'>Tìm Game</Button>
        </div>
      </div>
    </div>
  );
};
export default SearchGamePage;
