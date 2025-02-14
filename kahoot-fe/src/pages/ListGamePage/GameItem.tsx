import { IGame } from "@/interfaces/gameTypes";
import { ROUTES } from "@/routes/routePath";
import { useNavigate } from "react-router-dom";

interface GameItemProps {
  game: IGame;
}
const GameItem = ({ game }: GameItemProps) => {
  const navigate = useNavigate();
  const handleGoToGameDetail = () => {
    navigate(ROUTES.GAME_DETAIL.replace(":gameId", game.id));
  };
  return (
    <div onClick={handleGoToGameDetail} className='min-h-[150px] flex items-center justify-center'>
      <div className='max-w-[500px] px-2 w-full h-full text-white bg-[#466CF7] border-[0.2rem] border-[#533ECF] font-diablo rounded-[20px] relative text-2xl flex justify-center items-center cursor-pointer hover:bg-[#385ad6bf] hover:border-[#0026d2] active:bg-[#466CF7] transition-all select-none'>
        <span className='line-clamp-2'>{game.name} </span>
        <div className='absolute flex bottom-3 right-3 items-center text-xl gap-2'>
          <img className='w-6 h-6' src='/icons/icon-group-user.png' />
          <span>60</span>
        </div>
      </div>
    </div>
  );
};
export default GameItem;
