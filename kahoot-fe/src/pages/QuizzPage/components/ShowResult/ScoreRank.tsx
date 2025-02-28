import { IUserRanking } from "@/interfaces/roomTypes";
import PlayerItem from "./PlayerItem";

interface ScoreRankProps {
  userRanks: IUserRanking[];
}
const ScoreRank = ({ userRanks }: ScoreRankProps) => {
  return (
    <>
      <h5 className='font-diablo text-5xl mb-10'>Top 3</h5>
      <div className='flex flex-col gap-2 mt-2 justify-center items-center w-full'>
        {userRanks?.map((userRank, index) => (
          <PlayerItem player={userRank} key={index} />
        ))}
      </div>
    </>
  );
};
export default ScoreRank;
