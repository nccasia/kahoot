import { IUserRanking } from "@/interfaces/roomTypes";

interface TopRankProps {
  top3: IUserRanking[];
}
const TopRank = ({ top3 }: TopRankProps) => {
  return (
    <div className='flex items-end w-full max-w-[800px]'>
      <div className='w-1/3'>
        {top3[1] && (
          <div className='font-diablo text-lg flex flex-col justify-center items-center'>
            <img className='w-[70px] rounded-full mb-2' src={top3[1]?.avatar ?? "/icons/icon-user.png"} />
            <h5>{top3[1]?.userName}</h5>
            <span className='inline-flex justify-center items-center h-[40px] mt-1 mb-2 px-2 bg-gray-400 rounded-full min-w-[100px]'>
              {top3[1]?.totalPoint}
            </span>
          </div>
        )}
        <div className='w-full h-[120px] bg-[#cccccc63] rounded-sm flex items-end p-2'>
          <div className='w-full flex justify-center items-end'>
            <img className='w-[90px]' src='/backgrounds/rank2.png' alt='' />
          </div>
        </div>
      </div>
      <div className='w-1/3'>
        {top3[0] && (
          <div className='font-diablo text-lg flex flex-col justify-center items-center'>
            <img className='w-[70px] rounded-full mb-2' src={top3[0]?.avatar ?? "/icons/icon-user.png"} />
            <h5>{top3[0]?.userName}</h5>
            <span className='inline-flex justify-center items-center h-[40px] mt-1 mb-2 px-2 bg-gray-400 rounded-full min-w-[100px]'>
              {top3[0]?.totalPoint}
            </span>
          </div>
        )}
        <div className='w-full h-[140px] bg-[#3035849c] rounded-sm flex items-end p-2'>
          <div className='w-full flex justify-center items-end'>
            <img className='w-[100px]' src='/backgrounds/rank1.png' alt='' />
          </div>
        </div>
      </div>
      <div className='w-1/3'>
        {top3[2] && (
          <div className='font-diablo text-lg flex flex-col justify-center items-center'>
            <img className='w-[70px] rounded-full mb-2' src={top3[2]?.avatar ?? "/icons/icon-user.png"} />
            <h5>{top3[2]?.userName}</h5>
            <span className='inline-flex justify-center items-center h-[40px] mt-1 mb-2 px-2 bg-gray-400 rounded-full min-w-[100px]'>
              {top3[2]?.totalPoint}
            </span>
          </div>
        )}
        <div className='w-full h-[100px] bg-[#4e00ab70] rounded-sm flex items-end p-2'>
          <div className='w-full flex justify-center items-end'>
            <img className='w-[60px]' src='/backgrounds/rank3.png' alt='' />
          </div>
        </div>
      </div>
    </div>
  );
};
export default TopRank;
