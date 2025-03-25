import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { IQuestion } from "@/interfaces/questionTypes";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import { ROUTES } from "@/routes/routePath";
import GameActions from "@/stores/gameStore/gameAction";
import importQuestion from "@/utils/functions/importQuestion";
import { useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
interface IModalChooseFileProps {
  isOpen: boolean;
  onClose: () => void;
}
const ModalChooseFile = ({ isOpen, onClose }: IModalChooseFileProps) => {
  const { gameDispatch } = useContext(GameContext);
  const navigate = useNavigate();
  const onFileUpload = (files: File[]) => {
    try {
      const reader = new FileReader();
      const file = files[0];
      if (!file || file.type != "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        toast.warning("Bạn chỉ có thể chọn file word để nhập vào hệ thống");
        return;
      }

      reader.onload = (e) => {
        if (!e.target || !e.target.result) return;
        const content = e.target.result;
        const result = importQuestion(content);
        if (!result.isSuccess) {
          toast.error(result.message as string);
          return;
        }
        gameDispatch(GameActions.changeListQuestion(result.data as IQuestion[]));
        navigate(ROUTES.CREATE_GAME);
      };
      reader.onerror = (err) => console.error(err);
      reader.readAsBinaryString(file);
    } catch (e) {
      console.log(e);
      toast.error("Lỗi mất rồi, vui lòng thử lại sau");
    }
  };

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setSelectedFile(acceptedFiles[0]);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const handleCancel = () => {
    setSelectedFile(null);
    onClose();
  };
  const handleConfirm = () => {
    if (selectedFile) {
      onFileUpload([selectedFile]);
    }
    setSelectedFile(null);
    onClose();
  };

  return (
    <Modal showCloseButton={false} showHeader={false} isOpen={isOpen} onClose={onClose}>
      <div className='font-coiny flex justify-center items-center gap-2 text-white text-sm'>
        <span>Bạn có thể tải file câu hỏi mẫu </span>
        <a
          href='/example-list-question.docx'
          download='example-list-question.docx'
          className='text-[#ea0ad5] cursor-pointer animate-pulse'
          style={{ animationDuration: "0.5s" }}
        >
          tại đây
        </a>
      </div>
      <div
        {...getRootProps()}
        className={` mt-2 mb-2 min-h-[120px] p-6 text-center cursor-pointer rounded-lg transition-all duration-300 border-dashed border-[2px] flex justify-center items-center
        ${isDragActive ? "border-blue-500" : "border-gray-100 "}`}
      >
        <input {...getInputProps()} />
        <p className='text-white font-coiny'>
          {isDragActive ? (
            "Thả file của bạn vào đây..."
          ) : (
            <span>
              Kéo và thả file của bạn vào đây! <br /> Hoặc nhấn vào đây để chọn!
            </span>
          )}
        </p>
      </div>
      <div>
        {selectedFile && (
          <div className='flex justify-between items-center bg-[#758ac5] p-[2px] px-3 rounded-sm'>
            <p className='text-white'>{selectedFile.name}</p>
          </div>
        )}
      </div>
      <div className='flex justify-center mt-2 gap-3'>
        <Button onClick={handleCancel} className='bg-[#c02121] font-coiny'>
          Huỷ bỏ
        </Button>
        <Button
          style={{ backgroundColor: selectedFile ? "#6BB3E0" : "#4b4b4b" }}
          disabled={!selectedFile}
          onClick={handleConfirm}
          className=' font-coiny'
        >
          Xác nhận
        </Button>
      </div>
    </Modal>
  );
};
export default ModalChooseFile;
