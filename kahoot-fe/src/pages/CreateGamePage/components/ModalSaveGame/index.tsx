import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import GameActions from "@/stores/gameStore/gameAction";
import { useContext } from "react";

const ModalSaveGame = () => {
  const { gameState, gameDispatch } = useContext(GameContext);
  const handleCloseModal = () => {
    gameDispatch(GameActions.changeOpenModalSaveGame(false));
  };
  const handleConfirmSave = () => {
    // Save game
  };

  return (
    <Modal
      isOpen={gameState.openModalSaveGame}
      onClose={handleCloseModal}
      modalTitle='Nhập thông tin game'
      headerClassName='flex items-center justify-center font-bold text-lg font-diablo'
    >
      <div className='text-white text-sm font-diablo'>
        <div className='text-center '>
          <span className='text-sm '>Hãy điền thông tin game của bạn để mọi người biết đến dễ dàng hơn!</span>
        </div>
        <div className='mt-3'>
          <div className='mb-6'>
            <label className='block text-white text-sm font-bold mb-2' htmlFor='name'>
              Tên game
            </label>
            <input
              className='shadow appearance-none border bg-white rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
              id='name'
              type='text'
              placeholder='Nhập tên game của bạn'
            />
          </div>
          <div className='mb-6'>
            <label className='block text-white text-sm font-bold mb-2' htmlFor='description'>
              Mô tả của game
            </label>
            <textarea
              className='shadow appearance-none border bg-white rounded w-full py-2 px-3 text-gray-700 text-justify leading-tight focus:outline-none focus:shadow-outline'
              id='description'
              rows={10}
              placeholder='Nhập thông tin mô tả để tăng khả năng hiển thị của game'
            />
          </div>
          <div className='flex justify-end gap-3'>
            <Button onClick={handleCloseModal} className='bg-[#ee4242] text-white font-bold'>
              Huỷ bỏ
            </Button>
            <Button onClick={handleConfirmSave} className='bg-[#6B00E7] text-white font-bold'>
              Lưu lại
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSaveGame;
