import RichTextBox from "@/components/RichTextbox";
import { IChannelInfo } from "@/interfaces/appTypes";
import { ICreateScheduleRoom } from "@/interfaces/roomTypes";
import { AppContext } from "@/providers/ContextProvider/AppProvider";
import roomServices from "@/services/roomServices";
import { HttpStatusCode } from "axios";
import dayjs from "dayjs";
import React, { useContext, useEffect, useState } from "react";
import Modal from ".";
import Button from "../Button";
import MultiSelectDropdown, { OptionType } from "../MultiSelectDropdown";
interface ModalConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (scheduleData: ICreateScheduleRoom, roomId?: string) => void;
  roomId?: string;
  confirmText?: string;
  cancelText?: string;
  title?: React.ReactNode;
  isLoading?: boolean;
}
const ModalGameTimer = ({
  isOpen,
  onClose,
  onConfirm,
  roomId,
  confirmText = "Xác nhận",
  cancelText = "Huỷ bỏ",
  isLoading = false,
  title = "Bạn có chắc chắn muốn thực hiện hành động này không?",
}: ModalConfirmProps) => {
  const { appState } = useContext(AppContext);
  const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState(dayjs().format("HH:mm"));
  const [selectedChannels, setSelectedChannels] = useState<IChannelInfo[]>([]);
  const [isNotify, setIsNotify] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState<string>("")
  const [openModalShowNotify, setOpenModalShowNotify] = useState<boolean>(false)

  useEffect(() => {
    if (!roomId)
      return;
    (async () => {
      try {
          const response = await roomServices.getScheduledRoom(roomId);
          if (response.statusCode !== HttpStatusCode.Ok) {
            console.error("Error fetching scheduled room data:", response.message);
            return;
          }
          const roomData = response.data;
          setStartDate(dayjs(roomData?.scheduledAt).format("YYYY-MM-DD"));
          setStartTime(dayjs(roomData?.scheduledAt).format("HH:mm"));
          setIsNotify(roomData?.isNotifyEnabled || false);
          setNotifyMessage(roomData?.textMessage || "");
          setSelectedChannels(roomData?.channels || []);
      }
      catch (error) {
        console.error("Error fetching scheduled room data:", error);
      }
    })()
  }, [roomId]);
  
  const handleConfirm = () => {
    if (onConfirm) {
      const scheduleData: ICreateScheduleRoom = {
        scheduledAt: dayjs(`${startDate} ${startTime}`).toDate(),
        isNotifyEnabled: isNotify, 
        textMessage: notifyMessage,
        channels: selectedChannels,
      };
      onConfirm(scheduleData, roomId);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showHeader={false}
      showCloseButton={false}
      headerClassName='flex items-center justify-center font-bold text-lg font-coiny'
    >
      <div className='text-white text-sm font-coiny'>
        <div className='text-center mt-2 text-xl'>{title}</div>
        <div className="mt-10">
          <p className="text-lg font-coiny">Thiết lập thời gian</p>
          <div className="flex flex-wrap sm:flex-nowrap gap-3 justify-center items-center">
            <input
              type="time"
              name="timer"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="text-xl px-4 py-2 rounded-xl bg-purple-700 text-white font-bold shadow-lg outline-none border-2 border-purple-400 focus:ring-4 focus:ring-purple-300 hover:bg-purple-600 transition-all duration-200 w-full min-w-[200px] cursor-pointer text-center"
            />
            <input
              type="date"
              name="timer"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xl px-4 py-2 rounded-xl bg-purple-700 text-white font-bold shadow-lg outline-none border-2 border-purple-400 focus:ring-4 focus:ring-purple-300 hover:bg-purple-600 transition-all duration-200 w-full min-w-[200px] cursor-pointer text-center"
            />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="mt-4">
            <p className="text-lg font-coiny">Chọn channels cần thông báo</p>
            <MultiSelectDropdown
              dropdownPosition='bottom'
              selectedValues={selectedChannels?.map((item) => item.channelId) || []}
              options={appState.channelList?.map((item) => ({ label: item.channelName!, value: item.channelId! })) || []}
              onSelect={(selectedOptions: OptionType[]) => {
                const selectedChannels = appState.channelList?.filter((item) =>
                  selectedOptions.some((option) => option.value === item.channelId)
                );
                setSelectedChannels(selectedChannels || []);
              }}
            />
          </div>
          <div className="mt-4 flex items-center gap-2">
            <label htmlFor="send-notify-checkbox" className="relative w-5 h-5 cursor-pointer">
              <input
                onChange={(e) => setIsNotify(e.target.checked)}
                checked={isNotify}
                type="checkbox"
                className="peer w-full h-full cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-amber-600 checked:border-amber-600"
                id="send-notify-checkbox"
              />
              <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                </svg>
              </span>
            </label>
            <label htmlFor="send-notify-checkbox" className="text-md font-coiny text-slate-300 peer-checked:text-slate-200 cursor-pointer select-none">
              Gửi thông báo đến channels đã chọn
            </label>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between">
            <p className="text-lg font-coiny">Nội dung thông báo</p>
            <img onClick={() => setOpenModalShowNotify(true)} alt="icon-eye" src="/icons/icon-eye.png" className="w-[25px] cursor-pointer" />
          </div>
          <RichTextBox value={notifyMessage} onChange={(e) => setNotifyMessage(e.target.value)} rows={7} className="rounded-md border-[2px] w-full min-h-[200px] text-justify text-sm"></RichTextBox>
        </div>
        <div className='flex justify-center gap-3 mt-4'>
          <Button onClick={onClose} className='text-center bg-[#ded525] font-coiny '>
            {cancelText}
          </Button>
          <Button isLoading={isLoading} onClick={handleConfirm} className='text-center bg-[#e93d3d] font-coiny '>
            {confirmText}
          </Button>
        </div>
        <Modal
          isOpen={openModalShowNotify}
          onClose={() => {setOpenModalShowNotify(false)}}
          showHeader={false}
          showCloseButton={true}
          headerClassName='flex items-center justify-center font-bold text-lg font-coiny z-[1000]'
        >
          <div className="mt-3">
            <div className="rounded whitespace-pre-wrap text-justify">
              {notifyMessage}
            </div>
            <div className="mt-3 border-t-2 pt-2">
              <p className="font-coiny text-justify">Hãy nhập mã ... hoặc quét mã QR bằng ứng dụng Mezon để tham gia</p>
              <img alt="icon-qr" src="/icons/icon-qr-code.png" className="w-[180px]" />
            </div>
          </div>
        </Modal>
      </div>
    </Modal>
  );
};
export default ModalGameTimer;
