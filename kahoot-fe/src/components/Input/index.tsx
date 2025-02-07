interface InputProps {
  type?: string;
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  max?: number;
  min?: number;
}
const Input = ({ type = "text", placeholder, className, value, onChange, maxLength, min, max }: InputProps) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      maxLength={maxLength}
      max={max}
      min={min}
      onChange={onChange}
      className={`p-1 bg-[#6B00E7CC] text-white font-diablo outline-none rounded-full min-h-[50px] border-[0.2rem] border-[#1C0C8E] px-4 text-xl ${className}`}
    />
  );
};
export default Input;
