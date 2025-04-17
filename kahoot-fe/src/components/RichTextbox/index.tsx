interface RichTextBoxProps {
  placeholder?: string;
  className?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  rows?: number;
  cols?: number;
  maxLength?: number;
  disabled?: boolean;
}
const RichTextBox = ({
  disabled = false,
  placeholder,
  className,
  value,
  onChange,
  onFocus,
  onBlur,
  defaultValue,
  maxLength,
  rows=3,
  cols=5
}: RichTextBoxProps) => {
  return (
    <textarea
      disabled={disabled}
      autoComplete='off'
      placeholder={placeholder}
      value={value}
      rows={rows}
      cols={cols}
      maxLength={maxLength}
      defaultValue={defaultValue}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={onChange}
      className={`p-1 min-w-0 bg-[#6B00E7CC] text-white font-coiny outline-none rounded-full min-h-[50px] border-[0.2rem] border-[#1C0C8E] px-4 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent ${className}`}
    />
  );
};
export default RichTextBox;
