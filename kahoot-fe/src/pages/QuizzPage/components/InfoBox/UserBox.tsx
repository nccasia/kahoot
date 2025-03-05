import Button from "@/components/Button";
import { ICurrentUser } from "@/interfaces/authTypes";

interface UserBoxProps {
  user?: ICurrentUser;
  score?: number;
  isOwner?: boolean;
  onFinishGame?: () => void;
  onPauseGame?: () => void;
}
const UserBox = ({ user, score, isOwner = false, onFinishGame }: UserBoxProps) => {
  return (
    <div className='min-h-[200px] bg-[#919a9070] w-full rounded-xl flex flex-col items-center justify-center p-2 select-none cursor-pointer'>
      <div className='w-[120px] h-[120px] relative flex items-center justify-center '>
        <img className='w-[85px] h-[85px] rounded-full' src={user?.avatar ?? "/icons/icon-user.png"} />
        <img className=' w-[120px] absolute top-0 left-0' src='/backgrounds/bg-box.png' />
      </div>
      <div className='font-diablo flex flex-col flex-1 items-center justify-center tracking-widest gap-3 text-white'>
        <span className='text-xl'>{user?.userName ?? "quyen.nguyenta"}</span>
        {isOwner ? (
          <div className='flex gap-3 justify-center items-center mt-3 mb-3 flex-wrap'>
            <Button onClick={onFinishGame} className='font-diablo text-xl sm:text-sm md:text-lg bg-[#c60000]'>
              Kết thúc
            </Button>
            {/* <Button onClick={onPauseGame} className='font-diablo text-xl sm:text-sm md:text-lg bg-[#cdb400]'>
              Tạm dừng
            </Button> */}
          </div>
        ) : (
          <span className='text-2xl'>{score ?? 0}</span>
        )}
      </div>
    </div>
  );
};
export default UserBox;
