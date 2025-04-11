import { useState } from "react";

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

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <img
            src={src}
            className={`object-contain rounded-lg shadow-lg ${classNameZoom}`}
            alt="full preview"
          />
        </div>
      )}
    </>
  );
};

export default ImagePreview;
