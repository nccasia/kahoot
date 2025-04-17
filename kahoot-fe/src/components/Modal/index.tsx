import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  showCloseButton?: boolean;
  modalTitle?: string;
  showHeader?: boolean;
  children?: React.ReactNode;
  headerClassName?: string;
  bodyClassName?: string;
}
const Modal = ({
  isOpen,
  onClose,
  showCloseButton = true,
  modalTitle = "Modal Title",
  showHeader = true,
  children,
  headerClassName,
  bodyClassName,
}: ModalProps) => {
  return ReactDOM.createPortal(
  <>
    {isOpen && (
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
        <div
          className='bg-[#402a97] shadow-md shadow-cyan-700 text-white min-h-[100px] rounded-lg w-[95%] max-w-[500px] max-h-[95vh] transform fadeIn relative overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent'
          style={{ animationDelay: "unset", animationDuration: "0.2s" }}
        >
          {showHeader && (
            <div className={`text-white min-h-[50px] flex items-center px-4 border-b border-gray-300 ${headerClassName}`}>
              <span>{modalTitle}</span>
            </div>
          )}
          {showCloseButton && (
            <div
              className='text-red-600 text-2xl absolute top-1 right-1 h-[30px] w-[30px] flex items-center justify-center shadow-inner rounded-full cursor-pointer'
              onClick={onClose}
            >
              &times;
            </div>
          )}
          <div className={`body p-4 text-left text-white ${bodyClassName}`}>{children}</div>
        </div>
      </div>
    )}
  </>
  , document.body)
};
export default Modal;
