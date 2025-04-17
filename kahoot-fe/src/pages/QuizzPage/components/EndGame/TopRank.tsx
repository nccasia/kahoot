import { IUserRanking } from "@/interfaces/roomTypes";

interface TopRankProps {
  top3: IUserRanking[];
}
const TopRank = ({ top3 }: TopRankProps) => {
  return (
    <div className='flex items-end w-full max-w-[800px] px-2 md:px-4 py-2'>
      <div className='w-1/3'>
        {top3[1] && (
          <div className='font-coiny text-lg flex flex-col justify-center items-center'>
            <img className='w-[70px] h-[70px] rounded-full mb-2' src={top3[1]?.avatar ?? "/icons/icon-user.png"} />
            <h5 className="hidden md:block">{top3[1]?.userName}</h5>
            <div className='flex justify-center items-center gap-2 py-3 mt-3 px-5 mb-3 rounded-full bg-black '>
              <img className='w-[30px] h-[30px]' src='/icons/StarIcon.png' />
              <span className=''>{top3[1]?.totalPoint}</span>
            </div>
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
          <div className='font-coiny text-lg flex flex-col justify-center items-center'>
            <img className='w-[70px] h-[70px] rounded-full mb-2' src={top3[0]?.avatar ?? "/icons/icon-user.png"} />
            <h5 className="hidden md:block">{top3[0]?.userName}</h5>
            <div className='flex justify-center items-center gap-2 py-3 mt-3 px-5 mb-3 rounded-full bg-black '>
              <img className='w-[30px] h-[30px]' src='/icons/StarIcon.png' />
              <span className=''>{top3[0]?.totalPoint}</span>
            </div>
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
          <div className='font-coiny text-lg flex flex-col justify-center items-center'>
            <img className='w-[70px] h-[70px] rounded-full mb-2' src={top3[2]?.avatar ?? "/icons/icon-user.png"} />
            <h5 className="hidden md:block">{top3[2]?.userName}</h5>
            <div className='flex justify-center items-center gap-2 py-3 mt-3 px-5 mb-3 rounded-full bg-black '>
              <img className='w-[30px] h-[30px]' src='/icons/StarIcon.png' />
              <span className=''>{top3[2]?.totalPoint}</span>
            </div>
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
