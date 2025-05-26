import React from "react";
import Button from "../Button";

interface LoadingOverlayProps {
  title?: React.ReactNode;
  showCancelButton?: boolean;
  onCancel?: () => void;
}
const LoadingOverlay = ({ title = "Loading...", showCancelButton, onCancel }: LoadingOverlayProps) => {
  return (
    <div
      className=' backdrop-blur-md loading-overlay fixed z-50 top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-black bg-opacity-50 fadeIn'
      style={{ animationDelay: "unset", animationDuration: "0.3s" }}
    >
      <div className='loading-spinner'>
        <div className='spinner-3'></div>
      </div>
      <div className='mt-10 font-coiny text-2xl'>{title}</div>
      {showCancelButton && (
        <div className="flex items-center justify-center mt-4">
          <Button
            onClick={onCancel}
            className="text-center bg-[#e93d3d] font-coiny "
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
};
export default LoadingOverlay;
