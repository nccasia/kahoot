import React from "react";
import Modal from ".";
import Button from "../Button";

interface ModalConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  title?: React.ReactNode;
  isLoading?: boolean;
}
const ModalConfirm = ({
  isOpen,
  onClose,
  onConfirm,
  confirmText = "Xác nhận",
  cancelText = "Huỷ bỏ",
  isLoading = false,
  title = "Bạn có chắc chắn muốn thực hiện hành động này không?",
}: ModalConfirmProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      // modalTitle='Nhập thông tin game'
      showHeader={false}
      showCloseButton={false}
      headerClassName='flex items-center justify-center font-bold text-lg font-coiny'
    >
      <div className='text-white text-sm font-coiny'>
        <img className='w-[80px] mx-auto' src='/icons/icon-warning.png' />
        <div className='text-center mt-4 text-xl'>{title}</div>
        <div className='flex justify-center gap-3 mt-4'>
          <Button onClick={onClose} className='text-center bg-[#ded525] font-coiny '>
            {cancelText}
          </Button>
          <Button isLoading={isLoading} onClick={onConfirm} className='text-center bg-[#e93d3d] font-coiny '>
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
export default ModalConfirm;
