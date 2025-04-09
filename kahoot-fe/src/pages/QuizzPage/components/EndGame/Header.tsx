interface HeaderProps {
  isOwner: boolean;
  onOutGame: () => void;
  onPlayAgain: () => void;
}
const Header = ({ isOwner, onOutGame, onPlayAgain }: HeaderProps) => {
  return (
    <div className='w-full h-[100px] flex justify-center mb-5 bg-[#191c49] sticky top-0 z-10'>
      <div className="w-[250px] h-[100px] bg-[url('/backgrounds/bg-rank.png')] bg-no-repeat bg-cover bg-center text-gray-700 relative">
        <span className='absolute top-10 text-2xl font-coiny left-1/2 -translate-x-1/2 mt-2'>Xếp hạng</span>
      </div>
      <div
        onClick={onOutGame}
        className='w-[60px] h-[60px] flex justify-center items-center cursor-pointer absolute top-4 left-4 hover:scale-[0.98] transition-all active:scale-[1.0]'
      >
        <img src='/buttons/SmallButton-pressed.png' />
        <img className='w-[30px] absolute top-[12px] left-[12px]' src='/icons/ExitIcon.png' />
      </div>

      <div
        onClick={onPlayAgain}
        className='w-[60px] h-[60px] flex justify-center items-center cursor-pointer absolute top-4 right-4 hover:scale-[0.98] transition-all active:scale-[1.0]'
      >
        <img src={isOwner ? "/buttons/SmallButton.png" : "/buttons/SmallButton-disabled.png"} />
        <img className='w-[30px] absolute top-[12px] left-[15px]' src='/icons/RefreshIcon_1.png' />
      </div>
    </div>
  );
};
export default Header;
