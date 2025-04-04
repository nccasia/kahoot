import { IUserRanking } from "@/interfaces/roomTypes";

interface PlayerItemProps {
  player?: IUserRanking;
}
const PlayerItem = ({ player }: PlayerItemProps) => {
  return (
    <div className='max-w-[300px] w-full bg-[#3b3d3978] cursor-pointer min-h-[90px] rounded-lg flex items-center p-2 gap-2 shadow-xl filter brightness-100 hover:brightness-150 transition-all active:brightness-100'>
      <div className='w-[70px] h-[70px] rounded-lg border-2 border-white p-2'>
        <div
          className='w-full h-full  bg-center bg-contain rounded-md'
          style={{
            backgroundImage: `url(${player?.avatar || "/icons/icon-user.png"})`,
          }}
        ></div>
      </div>
      <div className='text-start flex flex-col gap-3 text-white flex-1'>
        <p className='font-coiny flex-1 block w-full line-clamp-1 h-[30px]'>{player?.userName ?? "Tên người chơi"}</p>
        <span className='font-coiny flex-1 line-clamp-1 h-[30px]'>{player?.totalPoint ?? 0}</span>
      </div>
    </div>
  );
};
export default PlayerItem;
