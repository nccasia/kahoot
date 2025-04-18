import { useNavigate } from "react-router-dom";

const ButtonBack = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.self !== window.top) {
      if (window.history.length > 2) {
        navigate(-1);
      } else {
        navigate("/");
      }
    } else {
      window.history.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className='rounded-full h-10 w-10 md:h-14 md:w-14 p-0 flex items-center justify-center bg-[#6bb3e0] border-[#158CFB] border-2 shadow-inner outline-none focus:outline-none'
    >
      <img src='/icons/icon-left.png' alt='back' className='w-5 h-5 md:w-7 md:h-7' />
    </button>
  );
};
export default ButtonBack;
