import { ICurrentUser } from "@/interfaces/authTypes";

interface PlayerItemProps {
  player: ICurrentUser;
}
const PlayerItem = ({ player }: PlayerItemProps) => {
  return (
    <div className='max-w-[300px] w-full bg-[#3b3d3978] cursor-pointer min-h-[90px] rounded-lg flex items-center p-2 gap-2 shadow-xl filter brightness-100 hover:brightness-150 transition-all active:brightness-100'>
      <div className='w-[70px] h-[70px] rounded-lg border-2 border-white p-2'>
        <div
          className='w-full h-full  bg-center bg-contain rounded-md'
          style={{
            backgroundImage: `url(${player.avatar || "/icons/icon-user.png"})`,
          }}
        ></div>
      </div>
      <span className='font-diablo flex-1 line-clamp-1'>{player.userName} </span>
    </div>
  );
};
export default PlayerItem;
