interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
  style?: React.CSSProperties;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
}
const Button = ({ children, className, onClick, isLoading = false, style, size = "medium", disabled = false }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        relative px-6 py-3 min-w-[120px] text-sm font-normal text-white transition-all duration-150 rounded-full outline-none focus:outline-none 
        shadow-[-2px_2px_0_0_#fff,-2px_2px_0_0px_#fff] border-none hover:no-underline 
        hover:shadow-[-1px_1px_0_0_#fff,-1px_1px_0_0px_#fff] hover:translate-x-[-1px] hover:translate-y-[1px] 
        active:shadow-[-0px_0px_0_0_#fff,-0px_0px_0_0px_#fff] active:translate-x-[-2px] active:translate-y-[2px]
        flex items-center justify-center gap-2
        filter brightness-100 hover:brightness-110
        ${size === "large" &&
        `shadow-[-4px_4px_0_0_#fff,-4px_4px_0_0px_#fff] border-none hover:no-underline 
              hover:shadow-[-3px_3px_0_0_#fff,-3px_3px_0_0px_#fff] hover:translate-x-[-1px] hover:translate-y-[1px] 
              active:shadow-[-0px_0px_0_0_#fff,-0px_0px_0_0px_#fff] active:translate-x-[-4px] active:translate-y-[4px]`
        }
        ${disabled &&
        `cursor-not-allowed ${size === "large" &&
        `hover:shadow-[-4px_4px_0_0_#fff,-4px_4px_0_0px_#fff] hover:translate-x-[0px] hover:translate-y-[0px]  hover:brightness-100
            active:shadow-[-4px_4px_0_0_#fff,-4px_4px_0_0px_#fff] active:translate-x-[-0px] active:translate-y-[0px]`
        }`
        }
        
        ${isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
        ${className}
        `}
      style={style}
    >
      {isLoading && <img className='w-4 animate-spin' src='/icons/icon-spin.png' />}
      {children}
    </button>
  );
};
export default Button;
