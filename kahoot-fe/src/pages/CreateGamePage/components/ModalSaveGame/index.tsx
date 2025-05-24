import Button from "@/components/Button";
import Modal from "@/components/Modal";
import { ICreateGameDTO } from "@/interfaces/gameTypes";
import { IAddQuestionToGameDTO } from "@/interfaces/questionTypes";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import gameServices from "@/services/gameServices";
import questionServices from "@/services/questionServices";
import GameActions from "@/stores/gameStore/gameAction";
import { useContext, useState } from "react";
import { toast } from "react-toastify";

const initialGameData: ICreateGameDTO = {
  name: "",
  description: "",
  status: "draft",
};
const ModalSaveGame = () => {
  const { gameState, gameDispatch } = useContext(GameContext);
  const [gameData, setGameData] = useState<ICreateGameDTO>(initialGameData);
  const handleCloseModal = () => {
    gameDispatch(GameActions.changeOpenModalSaveGame(false));
  };
  const handleChangeGameData = (key: string, value: string) => {
    setGameData((prev) => ({ ...prev, [key]: value }));
  };
  const handleConfirmSave = async () => {
    if (!gameData.name || gameData.name.trim() === "") {
      // toast.error("Vui lòng nhập tên game!");
      toast.error("Please enter the game name!");
      return;
    }
    try {
      const createGameResponse = await gameServices.createGame(gameData);
      if (
        !(
          createGameResponse.statusCode === 200 ||
          createGameResponse.statusCode === 201
        )
      ) {
        // toast.error("Lỗi khi lưu game!");
        toast.error("Error saving game!");
        return;
      }
      const gameId = createGameResponse.data.id;

      const listQuestions: IAddQuestionToGameDTO[] =
        gameState.listQuestions?.map((question) => ({
          mode: question.mode,
          title: question.title,
          time: question.time,
          answerOptions: question.answerOptions,
        }));
      const addQuestionsResponse = await questionServices.addQuestion(
        gameId,
        listQuestions
      );
      if (
        !(
          addQuestionsResponse.statusCode === 200 ||
          addQuestionsResponse.statusCode === 201
        )
      ) {
        // toast.error("Lỗi khi lưu câu hỏi!");
        toast.error("Error saving questions!");
        return;
      }
      // toast.success("Lưu game thành công!");
      toast.success("Game saved successfully!");
    } catch (error) {
      console.log("error", error);
      // toast.error("Lỗi khi lưu game!");
      toast.error("Error saving game!");
    }
  };

  return (
    <Modal
      isOpen={gameState.openModalSaveGame}
      onClose={handleCloseModal}
      // modalTitle='Nhập thông tin game'
      modalTitle="Enter Game Information"
      headerClassName="flex items-center justify-center font-bold text-lg font-coiny"
    >
      <div className="text-white text-sm font-coiny">
        <div className="text-center ">
          <span className="text-sm ">
            {/* Hãy điền thông tin game của bạn để mọi người biết đến dễ dàng hơn! */}
            Please fill in your game information so that others can easily find
            it!
          </span>
        </div>
        <div className="mt-3">
          <div className="mb-6">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="name"
            >
              {/* Tên game */}
              Game Name
            </label>
            <input
              value={gameData.name}
              onChange={(e) => handleChangeGameData("name", e.target.value)}
              className="shadow appearance-none border bg-white rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              // placeholder='Nhập tên game của bạn'
              placeholder="Enter your game name"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-white text-sm font-bold mb-2"
              htmlFor="description"
            >
              {/* Mô tả của game */}
              Game Description
            </label>
            <textarea
              value={gameData.description}
              onChange={(e) =>
                handleChangeGameData("description", e.target.value)
              }
              className="shadow appearance-none border bg-white rounded w-full py-2 px-3 text-gray-700 text-justify leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              rows={10}
              // placeholder='Nhập thông tin mô tả để tăng khả năng hiển thị của game'
              placeholder="Enter description to increase game visibility"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              onClick={handleCloseModal}
              className="bg-[#ee4242] text-white font-bold"
            >
              {/* Huỷ bỏ */}
              Cancel
            </Button>
            <Button
              onClick={handleConfirmSave}
              className="bg-[#6B00E7] text-white font-bold"
            >
              {/* Lưu lại */}
              Save
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalSaveGame;
