import { ICurrentUser } from "@/interfaces/authTypes";

interface UserBoxProps {
  user?: ICurrentUser;
}
const UserBox = ({ user }: UserBoxProps) => {
  return (
    <div className='min-h-[200px] bg-[#919a9070] w-full rounded-xl flex flex-col items-center justify-center p-2 select-none cursor-pointer'>
      <div className='w-[120px] h-[120px] relative flex items-center justify-center '>
        <img className='w-[85px] h-[85px] rounded-full' src={user?.avatar ?? "/icons/icon-user.png"} />
        <img className=' w-[120px] absolute top-0 left-0' src='/backgrounds/bg-box.png' />
      </div>
      <div className='font-diablo flex flex-col items-center justify-center tracking-widest gap-3'>
        <span>{user?.userName ?? "quyen.nguyenta"}</span>
        <span className='text-2xl'>10239</span>
      </div>
    </div>
  );
};
export default UserBox;
