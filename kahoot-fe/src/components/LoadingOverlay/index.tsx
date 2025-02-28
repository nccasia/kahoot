import React from "react";

interface LoadingOverlayProps {
  title?: React.ReactNode;
}
const LoadingOverlay = ({ title = "Loading..." }: LoadingOverlayProps) => {
  return (
    <div
      className=' backdrop-blur-md loading-overlay fixed z-50 top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center bg-black bg-opacity-50 fadeIn'
      style={{ animationDelay: "unset", animationDuration: "0.3s" }}
    >
      <div className='loading-spinner'>
        <div className='spinner-3'></div>
      </div>
      <div className='mt-10 font-diablo text-2xl'>{title}</div>
    </div>
  );
};
export default LoadingOverlay;
