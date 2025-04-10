/* eslint-disable @typescript-eslint/no-explicit-any */
import ModalConfirm from "@/components/Modal/ModalConfirm";
import { AuthContext } from "@/providers/ContextProvider/AuthProvider";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import { ROUTES } from "@/routes/routePath";
import gameServices from "@/services/gameServices";
import questionServices from "@/services/questionServices";
import roomServices from "@/services/roomServices";
import GameActions from "@/stores/gameStore/gameAction";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import GameInfoBox from "./components/GameInfoBox";
import QuestionBox from "./components/QuestionBox";

const GameDetail = () => {
  const { gameId } = useParams();
  const { gameState, gameDispatch } = useContext(GameContext);
  const [currentDeleteRoomId, setCurrentDeleteRoomId] = useState<string | null>(null);
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

    const getRooms = async () => {
      try {
        const response = await roomServices.getRoomOfGame(gameId, 1, 10, "");
        if (response.statusCode !== 200) {
          console.log("error", response);
          return;
        }
        const rooms = response.data;
        // Đảo ngược thứ tự
        const newestFirst = [...rooms].reverse();
        gameDispatch(GameActions.changeListRooms(newestFirst));
      } catch (error) {
        console.log("error", error);
      }
    };

    getRooms();
    getGameById();
    getGameQuestions();
  }, [gameDispatch, gameId]);

  useEffect(() => {
    gameDispatch(GameActions.changeOpenModalConfirmDeleteGame(false));
    gameDispatch(GameActions.changeSelectedGameId(""));
    gameDispatch(GameActions.changeOpenModalConfirmDeleteQuestion(false));
    gameDispatch(GameActions.changeSelectedQuestion(""));
    gameDispatch(GameActions.changeIsDeleting(false));
    gameDispatch(GameActions.changeIsCreateQuestionOfGame(false));
    gameDispatch(GameActions.changeIsUpdateQuestionOfGame(false));
    gameDispatch(GameActions.changeIsUpdateGame(false));
  }, [gameDispatch]);

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
  const handleConfirmDeleteRoom = async () => {
    if (!currentDeleteRoomId) return;
    gameDispatch(GameActions.changeIsDeleting(true));
    try {
      const response = await roomServices.deleteRoom(currentDeleteRoomId);
      if (response.statusCode !== 200) {
        console.log("error", response);
        return;
      }
      toast.success("Xoá phòng thành công!")!;
      // Cập nhật lại danh sách phòng
      const updatedRooms = gameState.listRooms.filter(room => room.id !== currentDeleteRoomId);
      gameDispatch(GameActions.changeListRooms(updatedRooms));
      setCurrentDeleteRoomId(null);
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
          onDeleteRoom={(roomId) => setCurrentDeleteRoomId(roomId)}
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
        <ModalConfirm
          isOpen={!!currentDeleteRoomId}
          onClose={() => setCurrentDeleteRoomId(null)}
          onConfirm={handleConfirmDeleteRoom}
          isLoading={gameState.isDeleting}
          title={
            <span>
              Bạn có chắc chắn <br /> muốn xoá Phòng này không?
            </span>
          }
          confirmText="Xác nhận xoá"
        />
      </div>
    </div>
  );
};
export default GameDetail;
