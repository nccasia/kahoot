/* eslint-disable @typescript-eslint/no-explicit-any */
import ModalConfirm from "@/components/Modal/ModalConfirm";
import { AuthContext } from "@/providers/ContextProvider/AuthProvider";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import { ROUTES } from "@/routes/routePath";
import gameServices from "@/services/gameServices";
import questionServices from "@/services/questionServices";
import GameActions from "@/stores/gameStore/gameAction";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import GameInfoBox from "./components/GameInfoBox";
import QuestionBox from "./components/QuestionBox";

const GameDetail = () => {
  const { gameId } = useParams();
  const { gameState, gameDispatch } = useContext(GameContext);
  const { authState } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!gameId) return;
    const getGameById = async () => {
      try {
        const response = await gameServices.getGameById(gameId);
        if (response.statusCode !== 200) {
          console.log("error", response);
          return;
        }
        gameDispatch(GameActions.changeSelectedGame(response.data));
      } catch (error) {
        console.log("error", error);
      }
    };
    const getGameQuestions = async () => {
      try {
        const response = await questionServices.getGameQuestion(gameId, 1, 999, "");
        if (response.statusCode !== 200) {
          console.log("error", response);
          return;
        }
        gameDispatch(GameActions.changeListQuestion(response.data));
      } catch (error) {
        console.log("error", error);
      }
    };
    getGameById();
    getGameQuestions();
  }, [gameDispatch, gameId]);

  const handleCloseModalConfirmDeleteGame = () => {
    gameDispatch(GameActions.changeOpenModalConfirmDeleteGame(false));
    gameDispatch(GameActions.changeSelectedGameId(""));
  };

  const handleCloseModalConfirmDeleteQuestion = () => {
    gameDispatch(GameActions.changeOpenModalConfirmDeleteQuestion(false));
    gameDispatch(GameActions.changeSelectedQuestion(""));
  };

  const handleConfirmDeleteGame = async () => {
    if (!gameState.selectedGameId) return;
    gameDispatch(GameActions.changeIsDeleting(true));
    try {
      const response = await gameServices.deleteGame(gameState.selectedGameId);
      if (response.statusCode !== 200) {
        console.log("error", response);
        return;
      }
      gameDispatch(GameActions.changeOpenModalConfirmDeleteGame(false));
      gameDispatch(GameActions.changeSelectedGameId(""));
      navigate(ROUTES.LIST_GAME);
      toast.success("Xoá game thành công!")!;
    } catch (error) {
      toast.error((error as any).response.data.data.message);
    } finally {
      gameDispatch(GameActions.changeIsDeleting(false));
    }
  };

  const handleConfirmDeleteQuestion = async () => {
    if (!gameState.selectedQuestion) return;
    gameDispatch(GameActions.changeIsDeleting(true));
    try {
      const response = await questionServices.deleteQuestion(gameState.selectedQuestion?.id ?? "");
      if (response.statusCode !== 200) {
        console.log("error", response);
        return;
      }
      toast.success("Xoá câu hỏi thành công!")!;
      gameDispatch(GameActions.changeOpenModalConfirmDeleteQuestion(false));
      gameDispatch(GameActions.changeSelectedQuestion(""));
      gameDispatch(GameActions.deleteQuestion(gameState.selectedQuestion?.id ?? ""));
    } catch (error) {
      toast.error((error as any).response.data.data.message);
    } finally {
      gameDispatch(GameActions.changeIsDeleting(false));
    }
  };

  return (
    <div className='max-w-[1200px] w-[100%] h-full p-2'>
      <div
        style={{ animationDelay: "unset" }}
        className='h-[calc(100%-40px)] bg-[#6b00e78a] flex mt-[20px]  rounded-[40px] overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent fadeIn '
      >
        <GameInfoBox
          owner={authState.currentUser?.userName}
          totalQuestion={gameState?.listQuestions.length}
          gameInfo={gameState.selectedGame}
        />
        <QuestionBox gameId={gameId ?? ""} questions={gameState.listQuestions} />
        <ModalConfirm
          isLoading={gameState.isDeleting}
          title={
            <span>
              Bạn có chắc chắn <br /> muốn xoá game này không?
            </span>
          }
          confirmText='Xác nhận xoá'
          onConfirm={handleConfirmDeleteGame}
          isOpen={gameState.openModalConfirmDeleteGame}
          onClose={handleCloseModalConfirmDeleteGame}
        />
        <ModalConfirm
          isLoading={gameState.isDeleting}
          title={
            <span>
              Bạn có chắc chắn <br /> muốn xoá câu hỏi này không?
            </span>
          }
          confirmText='Xác nhận xoá'
          onConfirm={handleConfirmDeleteQuestion}
          isOpen={gameState.openModalConfirmDeleteQuestion}
          onClose={handleCloseModalConfirmDeleteQuestion}
        />
      </div>
    </div>
  );
};
export default GameDetail;
