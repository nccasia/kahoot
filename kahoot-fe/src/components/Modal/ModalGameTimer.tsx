import React, { useState } from "react";
import Modal from ".";
import Button from "../Button";
import MultiSelectDropdown from "../MultiSelectDropdown";

interface ModalConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  title?: React.ReactNode;
  isLoading?: boolean;
}
const ModalGameTimer = ({
  isOpen,
  onClose,
  onConfirm,
  confirmText = "Xác nhận",
  cancelText = "Huỷ bỏ",
  isLoading = false,
  title = "Bạn có chắc chắn muốn thực hiện hành động này không?",
}: ModalConfirmProps) => {
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [startTime, setStartTime] = useState(
    () => {
      const today = new Date();
      return today.toTimeString().split(' ')[0].slice(0, 5);
    }
  );
  const getFullDateTime = () => {
    const [year, month, day] = startDate.split("-");
    return `Trò chơi sẽ bắt đầu vào lúc: ${startTime} ngày ${day} tháng ${month} năm ${year}`;
  };
  console.log("startDate", getFullDateTime());
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showHeader={false}
      showCloseButton={false}
      headerClassName='flex items-center justify-center font-bold text-lg font-coiny'
    >
      <div className='text-white text-sm font-coiny'>
        <div className='text-center mt-4 text-xl'>{title}</div>
        <div className="mt-10">
          <p className="text-xl font-coiny ">Hẹn giờ bắt đầu trò chơi </p>
          <div className="flex gap-3 justify-center items-center">
            <input
              type="time"
              name="timer"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="text-xl px-4 py-2 rounded-xl bg-purple-700 text-white font-bold shadow-lg outline-none border-2 border-purple-400 focus:ring-4 focus:ring-purple-300 hover:bg-purple-600 transition-all duration-200 w-full cursor-pointer text-center"
            />
            <input
              type="date"
              name="timer"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xl px-4 py-2 rounded-xl bg-purple-700 text-white font-bold shadow-lg outline-none border-2 border-purple-400 focus:ring-4 focus:ring-purple-300 hover:bg-purple-600 transition-all duration-200 w-full cursor-pointer text-center"
            />

          </div>
        </div>
        <div className="flex flex-col">
          <div className=" mt-4">
            <p className="text-xl font-coiny ">Chanel bạn muốn gửi lời mời </p>
            <MultiSelectDropdown
              dropdownPosition='bottom'
              options={['Vinh ', 'Ha Noi1 ', 'Quy Nhon', 'Nha cua chung', 'Ha Noi2', 'Ha Noi3'].map((item) => ({ label: item, value: item }))}
              onSelect={() => { }} />
          </div>
          <div className=" mt-4">
            <p className="text-xl font-coiny ">Clan bạn muốn gửi lời mời </p>
            <MultiSelectDropdown
              dropdownPosition='bottom'
              options={['KOMU', 'KAHOOT'].map((item) => ({ label: item, value: item }))}
              onSelect={() => { }} />
          </div>
        </div>
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
export default ModalGameTimer;
