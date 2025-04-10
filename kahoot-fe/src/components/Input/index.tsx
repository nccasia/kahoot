interface InputProps {
  type?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  maxLength?: number;
  max?: number;
  min?: number;
  disabled?: boolean;
}
const Input = ({
  disabled = false,
  type = "text",
  placeholder,
  className,
  value,
  onChange,
  onFocus,
  onBlur,
  defaultValue,
  maxLength,
  min,
  max,
}: InputProps) => {
  return (
    <input
      disabled={disabled}
      autoComplete='off'
      type={type}
      placeholder={placeholder}
      value={value}
      maxLength={maxLength}
      defaultValue={defaultValue}
      onFocus={onFocus}
      onBlur={onBlur}
      max={max}
      min={min}
      onChange={onChange}
      className={`p-1 bg-[#6B00E7CC] text-white font-coiny outline-none rounded-full min-h-[50px] border-[0.2rem] border-[#1C0C8E] px-4 text-xl ${className}`}
    />
  );
};
export default Input;
