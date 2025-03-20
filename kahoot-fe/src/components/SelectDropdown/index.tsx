import { useState } from "react";

type OptionType = {
  label: string;
  value: string | number;
};

type SelectDropdownProps = {
  options: OptionType[];
  onSelect: (option: OptionType) => void;
  leftIcon?: React.ReactNode;
  selectedValue?: string | number;
};

const SelectDropdown: React.FC<SelectDropdownProps> = ({ options, onSelect, selectedValue }) => {
  const [selected, setSelected] = useState<OptionType>(
    selectedValue ? options.find((option) => option.value === selectedValue) || options[0] : options[0]
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSelect = (option: OptionType) => {
    setSelected(option);
    setIsOpen(false);
    onSelect(option);
  };

  return (
    <div className='relative w-full'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full min-w-[50px] bg-[#6B00E7] flex items-center border border-transparent rounded shadow-sm py-3 px-1 text-left focus:outline-none focus:ring-2 focus:ring-blue-500'
      >
        <div className='w-8 flex justify-center items-center'>
          <img className='w-5' src='/icons/icon-clock.png' />
        </div>
        <span className='min-w-[40px]'>{selected.label}</span>
      </button>
      {isOpen && (
        <ul className='absolute w-full bg-[#6B00E7] filter brightness-110 border shadow-lg rounded-lg mb-1 max-h-60 overflow-auto z-10 bottom-full'>
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className='px-4 py-2 bg-[#6B00E7] hover:brightness-125 cursor-pointer'
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectDropdown;
