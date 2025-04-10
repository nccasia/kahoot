import Button from "@/components/Button";
import ButtonBack from "@/components/ButtonBack";
import Input from "@/components/Input";
import { IGame } from "@/interfaces/gameTypes";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import { ROUTES } from "@/routes/routePath";
import gameServices from "@/services/gameServices";
import GameActions from "@/stores/gameStore/gameAction";
import useDebounce from "@/utils/hooks/useDebounce";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RoomItem from "./GameItem";

const ListGamePage = () => {
  const { gameState, gameDispatch } = useContext(GameContext);
  const [searchText, setSearchText] = useState("");
  const text = useDebounce(searchText, 500);
  const navigate = useNavigate();

  const handleGoToCreateGame = () => {
    gameDispatch(GameActions.changeSelectedGame(null));
    gameDispatch(GameActions.changeListQuestion([]));
    navigate(ROUTES.CREATE_GAME_TYPE);
  };
  const handleChangeSearchText = (value: string) => {
    setSearchText(value);
  };

  useEffect(() => {
    let listGameToShow = gameState.listGames;
    if (text) {
      listGameToShow = gameState.listGames?.filter((game) => game.name.toLowerCase().includes(text.toLowerCase()));
    }
    gameDispatch(GameActions.changeFilterGames(listGameToShow));
  }, [gameDispatch, gameState.listGames, text]);

  useEffect(() => {
    const getListGame = async () => {
      try {
        const response = await gameServices.getListGame(1, 999, "");
        if (!(response.statusCode === 200 || response.statusCode === 201)) {
          console.log("error", response);
          toast.error("Lỗi khi lấy danh sách game!");
          return;
        }
        const listGame = response.data as IGame[];
        gameDispatch(GameActions.changeListGame(listGame));
      } catch (error) {
        console.log("error", error);
      }
    };
    getListGame();
  }, [gameDispatch]);
  return (
    <div className='max-w-[1200px] w-[100%] h-full p-2'>
      <div className='header h-[80px] flex justify-between items-center'>
        <div className='w-[100px] md:w-[150px]'>
          <ButtonBack />
        </div>
        <Input
          value={searchText}
          onChange={(e) => handleChangeSearchText(e.target.value)}
          placeholder='Tìm kiếm...'
          className='text-center w-[150px] md:w-[200px] placeholder-white'
        />
        <Button onClick={handleGoToCreateGame} className='text-center bg-[#6B00E7] font-coiny min-w-[80px] md:min-w-[150px]'>
          Tạo game
        </Button>
      </div>
      <div
        style={{ animationDelay: "unset" }}
        className='fadeIn h-[calc(100%-100px)] mt-[20px] bg-[#6B00E7CC] border-[0.6rem] border-[#1C0C8E] rounded-[40px] overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent'
      >
        {gameState?.filterGames?.length > 0 ? (
          <div className='grid grid-cols-1 lg:grid-cols-2  gap-4 p-4'>
            {gameState.filterGames?.map((item, index) => (
              <RoomItem game={item} key={index} />
            ))}
          </div>
        ) : (
          <div className='flex justify-center items-center h-[400px] flex-col gap-5 text-white font-coiny text-2xl'>
            <span>Bạn chưa tạo game nào trước đó!</span>
            <Button onClick={handleGoToCreateGame} className='text-center bg-[#6BB3E0] font-coiny min-w-[100px] md:min-w-[150px]'>
              Tạo game
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ListGamePage;
