import PlayerItem from "./PlayerItem";

const ScoreRank = () => {
  return (
    <>
      <h5 className='font-diablo text-5xl mb-10'>Top 3</h5>
      <div className='flex flex-col gap-2 mt-2 justify-center items-center w-full'>
        {Array.from({ length: 3 }).map((_, index) => (
          <PlayerItem key={index} />
        ))}
      </div>
    </>
  );
};
export default ScoreRank;
