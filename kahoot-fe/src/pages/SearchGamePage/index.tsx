import Button from "@/components/Button";
import SocketEvents from "@/constants/SocketEvents";
import { useSocket } from "@/providers/SocketProvider";
import { ROUTES } from "@/routes/routePath";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchGamePage = () => {
  const [searchText, setSearchText] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();
  const handleSearchGame = () => {
    if (searchText.length < 6) return;
    // Call API to search game by pin
    if (!socket) return;
    socket.emit(SocketEvents.EMIT.ClientEmitJoinRoom, { roomCode: searchText });
  };
  const handleBackToListGame = () => {
    // if (window.history.length > 2) {
    //   navigate(-1);
    // } else {
    //   navigate("/");
    // }
    navigate(ROUTES.HOME);
  };

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
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            type='text'
            placeholder='Nhập mã pin'
            maxLength={6}
            className='w-full text-center text-white placeholder:text-white bg-transparent border-2 border-gray-500 p-2 rounded-lg  focus:border-2 focus-within:bottom-2 focus-visible:border-2 outline-none focus:border-gray-900'
          />
          <div className='flex w-full gap-2'>
            <Button onClick={handleBackToListGame} className='w-full flex-1 mt-2 bg-[#d43d3d]'>
              Quay lại
            </Button>
            <Button onClick={handleSearchGame} className='w-full mt-2 bg-[#6BB3E0]'>
              Tìm Game
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchGamePage;
