import { useState } from "react";

interface CollapseProps {
  children: React.ReactNode;
  content: React.ReactNode;
}
const Collapse = ({ children, content }: CollapseProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToogle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className='w-full bg-[#466CF7A1] rounded-xl'>
      <div
        onClick={handleToogle}
        className='rounded-xl flex justify-between items-center gap-2 p-4 bg-[#466CF7A1] cursor-pointer border-b border-[#fff] transition-all duration-500 ease-in-out'
        style={{
          borderBottomRightRadius: isOpen ? 0 : undefined,
          borderBottomLeftRadius: isOpen ? 0 : undefined,
          borderColor: isOpen ? "#fff" : "transparent",
        }}
      >
        <div className='flex-1'>{children}</div>
        <div className='w-[50px] flex justify-end '>
          <svg
            data-accordion-icon
            className='w-4 h-4 rotate-180 shrink-0'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 10 6'
          >
            <path stroke='#fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M9 5 5 1 1 5' />
          </svg>
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[1000px]" : "max-h-0"}`}>
        <div className='body p-4 text-white'>{content}</div>
      </div>
    </div>
  );
};
export default Collapse;
