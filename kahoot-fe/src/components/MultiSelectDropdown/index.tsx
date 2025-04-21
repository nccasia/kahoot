import { useEffect, useRef, useState } from "react";

export type OptionType = {
  label: string | undefined;
  value: string | number
};

type SelectDropdownProps = {
  options: OptionType[];
  onSelect: (selectedOptions: OptionType[]) => void;
  leftIcon?: React.ReactNode;
  selectedValues?: (string | number)[];
  dropdownPosition?: "top" | "bottom";
};

const MultiSelectDropdown: React.FC<SelectDropdownProps> = ({
  options,
  onSelect,
  selectedValues = [],
  dropdownPosition = "top",
  leftIcon,
}) => {
  const [selected, setSelected] = useState<OptionType[]>(
    options.filter((option) => selectedValues.includes(option.value))
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: OptionType) => {
    let newSelected: OptionType[];

    const alreadySelected = selected.find((s) => s.value === option.value);

    if (alreadySelected) {
      newSelected = selected.filter((s) => s.value !== option.value);
    } else {
      newSelected = [...selected, option];
    }

    setSelected(newSelected);
    onSelect(newSelected);
  };

  const isSelected = (value: string | number) =>
    selected.some((s) => s.value === value);

  useEffect(() => {
    setSelected(options.filter((option) => selectedValues.includes(option.value)));
  }, [options, selectedValues]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-w-[50px] bg-[#6B00E7] flex items-center border border-transparent rounded shadow-sm py-3 px-1 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {leftIcon && <div className="w-8 flex justify-center items-center">{leftIcon}</div>}
        <span className="ml-3 text-lg flex flex-wrap gap-1">
          {selected.length > 0 ? (
            selected.map((s) => (
              <span
                key={s.value}
                className="bg-white text-purple-700 rounded-full px-2 pb-1 pt-2 text-sm font-semibold"
              >
                {s.label}
              </span>
            ))
          ) : (
            <span className="text-white">Chọn...</span>
          )}
        </span>
      </button>
      {isOpen && (
        <ul
          className={`absolute w-full bg-[#6B00E7] filter brightness-110 border shadow-lg rounded-lg mb-1 mt-1 max-h-60 overflow-auto z-10 ${dropdownPosition === "top" ? "bottom-full" : "top-full"
            }`}
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option)}
              className={`px-4 py-2 cursor-pointer ${isSelected(option.value)
                ? "bg-purple-500 text-white"
                : "hover:bg-purple-300"
                }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
