interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
}
const Button = ({ children, className }: ButtonProps) => {
  return (
    <button
      className={`
        relative inline-block px-6 py-3 min-w-[120px] text-sm font-normal text-white transition-all duration-150 bg-[#6bb3e0] rounded-full outline-none focus:outline-none 
        shadow-[-2px_2px_0_0_#fff,-2px_2px_0_1px_#000] border-none hover:no-underline 
        active:shadow-[-1px_1px_0_0_#fff,-1px_1px_0_1px_#000] active:translate-x-[-1px] active:translate-y-[1px] 
        ${className}
        `}
    >
      {children}
    </button>
  );
};
export default Button;
