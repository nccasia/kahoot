import Button from "@/components/Button";
import ButtonBack from "@/components/ButtonBack";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import { ROUTES } from "@/routes/routePath";
import GameActions from "@/stores/gameStore/gameAction";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalChooseFile from "./ModalChooseFile";

const CreateGameTypePage = () => {
  const navigate = useNavigate();
  const [openModalChooseFile, setOpenModalChooseFile] = useState(false);
  const { gameDispatch } = useContext(GameContext);
  const handleAddQuestionHandmade = () => {
    gameDispatch(GameActions.changeListQuestion([]));
    navigate(ROUTES.CREATE_GAME);
  };
  const handleAddQuestionFromFile = () => {
    setOpenModalChooseFile(true);
  };

  return (
    <div className='max-w-[1200px] w-[100%] h-full p-2'>
      <div className='header h-[80px] flex justify-between items-center'>
        <ButtonBack />
      </div>
      <div className='w-full h-[calc(100%-80px)] flex justify-center items-center flex-col'>
        <div className='text-white text-2xl text-center font-coiny mb-8'>
          <span>
            Bạn muốn thêm câu hỏi <br /> bằng cách nào?
          </span>
        </div>
        <div className='flex gap-4 flex-wrap justify-center items-center'>
          <Button
            onClick={handleAddQuestionHandmade}
            size='large'
            className='w-[250px] h-[150px] bg-[#6BB3E0] rounded-lg flex justify-center items-center'
          >
            <div className='flex flex-col items-center'>
              <img className='w-20' src='/icons/icon-handmade.png' />
              <span className='font-coiny mt-3'>Thêm câu hỏi thủ công</span>
            </div>
          </Button>
          <Button
            onClick={handleAddQuestionFromFile}
            size='large'
            className='w-[250px] h-[150px] bg-[#B2ADFF] rounded-lg flex justify-center items-center'
          >
            <div className='flex flex-col items-center'>
              <img className='w-20' src='/icons/icon-file.png' />
              <span className='font-coiny mt-3'>Thêm câu hỏi từ file word</span>
            </div>
          </Button>
        </div>
      </div>
      <ModalChooseFile isOpen={openModalChooseFile} onClose={() => setOpenModalChooseFile(false)} />
    </div>
  );
};
export default CreateGameTypePage;
