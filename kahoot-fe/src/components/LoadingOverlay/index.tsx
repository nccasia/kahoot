const LoadingOverlay = () => {
  return (
    <div
      className='backdrop-blur-md loading-overlay fixed z-50 top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 fadeIn'
      style={{ animationDelay: "unset", animationDuration: "0.3s" }}
    >
      <div className='loading-spinner'>
        <div className='spinner-3'></div>
      </div>
    </div>
  );
};
export default LoadingOverlay;
