import Button from '@/components/Button';
import Modal from '@/components/Modal';
import { CopyTypes } from "@/constants/CopyTypes";
import ENV from '@/constants/Environment';
import { QRCodeSVG } from 'qrcode.react';
import { Tooltip } from 'react-tooltip';
interface IModalShowQRProps {
  isOpen: boolean;
  onCancel: () => void;
  copyLinkText: string;
  setCopyLinkText: (text: string) => void;
  handleCopy: (type: CopyTypes) => void;
  urlData: {
    channelId: string;
    clanId: string;
    code: string;
  }
}
const ModalShowQR = (
  {isOpen, onCancel,  handleCopy, urlData, copyLinkText, setCopyLinkText}: IModalShowQRProps
) => {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} showHeader={false}>
      <div className="w-full flex justify-center items-center flex-col" style={{aspectRatio: 1}}>
        <p className='max-w-[300px] text-center mb-3 font-coiny'>Hãy quét mã QR bên dưới bằng ứng dụng Mezon để tham gia trò chơi</p>
      <QRCodeSVG
          value={((): string => {
            const params = new URLSearchParams({
              code: urlData.code ?? "",
              subpath: '/play',
            });
            return `${ENV.MEZON_URL}/channel-app/${urlData.channelId}/${urlData?.clanId}?${params.toString()}`;
          })()}
              fgColor="white"
              bgColor="transparent"
              size={250}
              className="w-full"
            />
        <div
          data-tooltip-id="copy-link-btn"
          data-tooltip-content={copyLinkText ?? "Sao chép liên kết"}
          onClick={() => {
            handleCopy(CopyTypes.Link);
          }}
          onMouseLeave={() => {
            setCopyLinkText("Sao chép liên kết");
          }}
          className="mt-3 cursor-pointer font-coiny">
            <Button className='w-full h-full flex justify-center items-center gap-2 bg-[#6B00E7] text-white rounded-lg'>
              <span className="text-md">Sao chép liên kết</span>
            </Button>
          <Tooltip id="copy-link-btn" />
        </div>
      </div>
    </Modal>
  )
}

export default ModalShowQR