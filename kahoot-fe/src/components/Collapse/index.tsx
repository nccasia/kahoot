import { useEffect, useState } from "react";

interface CollapseProps {
  children: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
  hasError?: string;
  changeCollapse?: (isOpen: boolean) => void;
  disabled?: boolean;
}
const Collapse = ({ children, content, open, changeCollapse, hasError, disabled = false }: CollapseProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleToogle = () => {
    if (disabled) return;
    if (changeCollapse) {
      changeCollapse(!isOpen);
    }
    setIsOpen(!isOpen);
  };
  useEffect(() => {
    setIsOpen(open || false);
  }, [disabled, open]);
  return (
    <div className={`w-full bg-[#466CF7A1] rounded-xl border-2 ${hasError ? " border-red-600" : "border-transparent"}`}>
      <button
        onClick={handleToogle}
        className={`rounded-xl w-full outline-none border-none focus:ring-0 focus:outline-none flex justify-between items-center gap-2 p-2 lg:p-4 ${hasError && "pt-6 lg:pt-6"} bg-[#466CF7A1] cursor-pointer transition-all duration-500 ease-in-out relative`}
        style={{
          borderBottomRightRadius: isOpen ? 0 : undefined,
          borderBottomLeftRadius: isOpen ? 0 : undefined,
          borderBottomWidth: "2px",
          borderBottomColor: isOpen ? "#fff" : "transparent",
        }}
      >
        {hasError && (
          <div className='absolute top-1 items-center left-1 flex gap-2'>
            <img className='w-[20px] h-20px' src='/icons/exclamation.png' />
            <span className="flex-1 text-red-600 font-coiny text-sm">{hasError}</span>
          </div>
        )}
        <div className='flex-1'>{children}</div>
        <div
          className={`w-[16px] flex justify-end ${isOpen ? "rotate-180" : "rotate-0"} transition-all duration-500 ease-in-out`}
        >
          <svg
            data-accordion-icon
            className='w-4 h-4 rotate-180 shrink-0'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 10 6'
          >
            <path stroke='#fff' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5 5 1 1 5' />
          </svg>
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[1000px]" : "max-h-0"}`}>
        <div className='body p-2 lg:p-4 text-white'>{content}</div>
      </div>
    </div>
  );
};
export default Collapse;
