import { IUserRanking } from "@/interfaces/roomTypes";

interface ListRankProps {
  userRankings: IUserRanking[];
  totalQuestion: number;
}
const ListRank = ({ userRankings, totalQuestion }: ListRankProps) => {
  return (
    <div className='w-full max-w-[800px] mt-3 px-4 py-2'>
      {[
        ...userRankings,
        ...userRankings,
        ...userRankings,
        ...userRankings,
        ...userRankings,
        ...userRankings,
        ...userRankings,
        ...userRankings,
        ...userRankings,
        ...userRankings,
        ...userRankings,
        ...userRankings,
        ...userRankings,
        ...userRankings,
      ]?.map((userRanking, index) => (
        <div
          key={index}
          className='flex font-coiny w-full bg-[#00020dad] rounded-sm p-2 mb-2 min-h-[50px] items-center cursor-pointer filter hover:brightness-125 hover:bg-[#00020d]'
        >
          <div className='w-[50px]'>
            <span>{index + 1}</span>
          </div>
          <div className='w-[200px]'>
            <span>{userRanking?.userName}</span>
          </div>
          <div className='w-[100px]'>
            <span>{userRanking?.totalPoint}</span>
          </div>
          <div className='flex-1'>
            <div className='w-full bg-[#ff0000c7] h-[25px] rounded-md text-start relative overflow-hidden'>
              <div
                className={`h-full inline-block bg-[#077f05]`}
                style={{
                  borderTopLeftRadius: 6,
                  borderBottomLeftRadius: 6,
                  width: `${Math.floor((userRanking?.totalCorrect / totalQuestion) * 100)}%`,
                }}
              ></div>
              <div className='absolute left-2 text-white top-1/2 -translate-y-1/2 flex items-center gap-1'>
                <span>{userRanking.totalCorrect}</span>
                <span>|</span>
                <span>{totalQuestion}</span>
              </div>
            </div>
          </div>
          <div className='w-[50px]'>
            <span>&#10006;</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListRank;
