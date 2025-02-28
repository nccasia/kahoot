import { useEffect, useState } from "react";

interface RangeSliderProps {
  time: number;
}
export default function RangeSlider({ time }: RangeSliderProps) {
  const [value, setValue] = useState(100);

  useEffect(() => {
    setValue(100);
    const timeInterval = time * 1000; // Chuyển giây thành mili giây
    const timeStep = timeInterval / 200; // Mỗi 100ms giảm 1%
    const interval = setInterval(() => {
      setValue((prev) => (prev > 0 ? prev - 0.5 : 0)); // Giảm mỗi 100ms
    }, timeStep);

    return () => clearInterval(interval); // Dọn dẹp khi component unmount
  }, [time]);

  return (
    <div className='flex flex-col items-center space-y-4 w-full'>
      <input
        className='rounded-lg overflow-hidden appearance-none bg-gray-400 h-3 w-128 w-full transition-all duration-300'
        type='range'
        min='1'
        max='100'
        value={value}
      />
    </div>
  );
}
