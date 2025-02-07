const RoomItem = () => {
  return (
    <div className='min-h-[140px] flex items-center justify-center'>
      <div className='max-w-[300px] w-full h-full text-white bg-[#466CF7] border-[0.2rem] border-[#533ECF] font-diablo rounded-[20px] relative text-3xl flex justify-center items-center cursor-pointer hover:bg-[#385ad6bf] hover:border-[#0026d2] active:bg-[#466CF7] transition-all select-none'>
        <span>XSMB98</span>
        <div className='absolute flex bottom-3 right-3 items-center text-xl gap-2'>
          <img className='w-6 h-6' src='/icons/icon-group-user.png' />
          <span>60</span>
        </div>
      </div>
    </div>
  );
};
export default RoomItem;
