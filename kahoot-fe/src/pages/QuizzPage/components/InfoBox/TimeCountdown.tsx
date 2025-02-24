import { useEffect, useState } from "react";

const TimeCountdown = ({ timeLeft }: { timeLeft: number }) => {
  const [timeCountDown, setTimeCountDown] = useState(timeLeft);

  useEffect(() => {
    setTimeCountDown(timeLeft);
  }, [timeLeft]);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeCountDown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    if (timeCountDown == 0) {
      clearInterval(interval);
      return;
    }
    return () => clearInterval(interval);
  }, [timeCountDown]);
  return (
    <div className='flex items-center justify-center w-full px-4 mt-5 mb-5 relative'>
      <div className='time-box font-diablo text-5xl items-center justify-center absolute z-10 flex gap-1 top-4 animate-bounce'>
        <span>{Math.floor(timeCountDown / 60) >= 0 ? `0${Math.floor(timeCountDown / 60)}`.slice(-2) : "00"}</span>
        <span>:</span>
        <span>{timeCountDown % 60 >= 0 ? `0${timeCountDown % 60}`.slice(-2) : "00"} </span>
      </div>
      <img className='w-[300px] h-[70px]' src='/backgrounds/bg-time.png' />
    </div>
  );
};
export default TimeCountdown;
