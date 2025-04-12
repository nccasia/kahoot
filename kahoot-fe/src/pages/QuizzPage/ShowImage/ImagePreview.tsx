import { useState } from "react";
import { createPortal } from "react-dom";

type ImagePreviewProps = {
  src: string;
  classNameDefault?: string;
  classNameZoom?: string;
};

const ImagePreview: React.FC<ImagePreviewProps> = ({
  src,
  classNameDefault = "",
  classNameZoom = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  if (!src) return null;

  return (
    <>
      <img
        src={src}
        onClick={() => setIsOpen(true)}
        className={`cursor-pointer rounded-md ${classNameDefault}`}
        alt="preview"
      />

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black bg-opacity-80 flex items-center justify-center"
            onClick={() => setIsOpen(false)}
          >
            <img
              src={src}
              className={`object-contain max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg ${classNameZoom}`}
              alt="full preview"
            />
          </div>,
          document.body
        )}
    </>
  );
};

export default ImagePreview;
