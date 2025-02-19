import Button from "@/components/Button";
import { AppContext } from "@/providers/ContextProvider/AppProvider";
import { ROUTES } from "@/routes/routePath";
import AppActions from "@/stores/appStore/appAction";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const handleGoToSearchGame = () => {
    // Go to search game page
    navigate(ROUTES.SEARCH_ROOM);
  };
  const handleGoToCreateGame = () => {
    // Go to create game page
    navigate(ROUTES.LIST_GAME);
  };
  const { appState, appDispatch } = useContext(AppContext);
  useEffect(() => {
    if (appState.isShowSplash) {
      const timeOut = setTimeout(() => {
        appDispatch(AppActions.changeIsShowSplash(false));
      }, 8000);
      return () => clearTimeout(timeOut);
    }
  }, [appDispatch, appState.isShowSplash]);
  return (
    <div>
      <div
        className={`flex flex-col items-center justify-center h-screen gap-10 opacity-0 fadeIn`}
        style={{ animationDelay: appState.isShowSplash ? "7s" : "unset" }}
      >
        <h2
          className='font-diablo text-[70px] sm:text-[100px] md:text-[150px] select-none text-white'
          style={{ textShadow: "0px 15px #616BDC" }}
        >
          ĐỐ BạN
        </h2>
        <div className='flex flex-col gap-3 min-w-[200px] sm:min-w-[250px] md:min-w-[300px]'>
          <Button onClick={handleGoToSearchGame} className='font-diablo text-xl sm:text-2xl md:text-3xl bg-[#6BB3E0]'>
            Tìm Game
          </Button>
          <Button onClick={handleGoToCreateGame} className='font-diablo text-xl sm:text-2xl md:text-3xl bg-[#6F7CDD]'>
            Tạo Game
          </Button>
          <Button className='font-diablo text-xl sm:text-2xl md:text-3xl bg-[#B2ADFF]'>Cài Đặt</Button>
        </div>
      </div>
      <div className='fadeOut' style={{ animationDelay: appState.isShowSplash ? "8s" : "unset" }}>
        <div
          className={`logo-container fixed top-[50%] -translate-y-1/2 left-[50%] -translate-x-1/2 flex justify-center items-center w-full max-w-[400px] sm:max-w-[600px] md:max-w-[800px] before:w-[95%] `}
        >
          <h1
            id='page-logo'
            style={{ textShadow: "0px 15px #616BDC" }}
            className='font-diablo text-[100px] sm:text-[150px] md:text-[200px] text-white flex items-center justify-center gap-4 sm:gap-6 md:gap-10 flex-wrap'
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
      </div>
    </div>
  );
};
export default HomePage;
