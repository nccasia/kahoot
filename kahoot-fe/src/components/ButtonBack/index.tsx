import { useNavigate } from "react-router-dom";

const ButtonBack = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };
  return (
    <button
      onClick={handleBack}
      className='rounded-full h-14 w-14 p-0 flex items-center justify-center bg-[#6bb3e0] border-[#158CFB] border-2 shadow-inner outline-none focus:outline-none'
    >
      <img src='/icons/icon-left.png' alt='back' className='w-7 h-7' />
    </button>
  );
};
export default ButtonBack;
