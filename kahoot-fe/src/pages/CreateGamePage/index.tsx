import Button from "@/components/Button";
import ButtonBack from "@/components/ButtonBack";
import Input from "@/components/Input";
import { ICreateGameDTO } from "@/interfaces/gameTypes";
import { IAddQuestionToGameDTO, IQuestion } from "@/interfaces/questionTypes";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import { ROUTES } from "@/routes/routePath";
import gameServices from "@/services/gameServices";
import questionServices from "@/services/questionServices";
import GameActions from "@/stores/gameStore/gameAction";
import generateId from "@/utils/functions/generateId";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ModalSaveGame from "./components/ModalSaveGame";
import QuestionItem from "./components/QuestionItem";

const initialGameData: ICreateGameDTO = {
  name: "",
  description: "abcd",
  status: "draft",
};

const CreateGamePage = () => {
  const { gameState, gameDispatch } = useContext(GameContext);
  const [gameData, setGameData] = useState<ICreateGameDTO>(initialGameData);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleAddQuestion = useCallback(() => {
    const id = generateId(6, "mixed");
    const newQuestion: IQuestion = {
      id,
      mode: "normal",
      title: "",
      time: 30,
      answerOptions: {
        options: ["", "", "", ""],
        correctIndex: null,
      },
    };
    gameDispatch(GameActions.addQuestion(newQuestion));
    gameDispatch(GameActions.changeSelectedQuestion(id));
  }, [gameDispatch]);

  const handleChangeGameData = (key: string, value: string) => {
    setGameData((prev) => ({ ...prev, [key]: value }));
  };

  const checkQuestionData = useCallback(() => {
    const listQuestions = gameState.listQuestions as IQuestion[];
    if (!listQuestions || listQuestions.length === 0) {
      toast.error("Bạn chưa thêm câu hỏi nào!")!;
      return false;
    }
    let check = true;
    const listErrorQuestion: string[] = [];
    listQuestions.forEach((question) => {
      const checkAnswerOptions = question.answerOptions.options.every((option) => option && option.trim() !== "");
      const checkTitle = question.title && question.title.trim() !== "";
      const checkCorrectIndex = question.answerOptions.correctIndex !== null && question.answerOptions.correctIndex >= 0;
      if (!checkAnswerOptions || !checkTitle || !checkCorrectIndex) {
        listErrorQuestion.push(question?.id ?? "");
        check = false;
      }
    });
    const newListQuestion = listQuestions?.map((question) => {
      if (listErrorQuestion.includes(question.id ?? "")) {
        return {
          ...question,
          isError: true,
        };
      } else {
        return {
          ...question,
          isError: false,
        };
      }
    });
    gameDispatch(GameActions.changeListQuestion(newListQuestion));
    if (!check) {
      return false;
    }
    return true;
  }, [gameState.listQuestions, gameDispatch]);

  const handleSaveGame = useCallback(async () => {
    if (!gameData.name || gameData.name.trim() === "") {
      toast.error("Vui lòng nhập tên game!");
      return;
    }
    const check = checkQuestionData();
    if (!check) {
      toast.error("Hãy kiểm tra lại thông tin câu hỏi!");
      return;
    }
    try {
      setIsLoading(true);
      const createGameResponse = await gameServices.createGame(gameData);
      if (!(createGameResponse.statusCode === 200 || createGameResponse.statusCode === 201)) {
        toast.error("Lỗi khi lưu game!");
        return;
      }
      const gameId = createGameResponse.data.id;
      const listQuestions: IAddQuestionToGameDTO[] = gameState.listQuestions?.map((question) => ({
        mode: question.mode,
        title: question.title,
        time: question.time,
        answerOptions: question.answerOptions,
      }));
      const addQuestionsResponse = await questionServices.addQuestion(gameId, listQuestions);
      if (!(addQuestionsResponse.statusCode === 200 || addQuestionsResponse.statusCode === 201)) {
        toast.error("Lỗi khi lưu câu hỏi!");
        return;
      }
      toast.success("Lưu game thành công!");
      navigate(ROUTES.LIST_GAME);
      setGameData(initialGameData);
      gameDispatch(GameActions.changeListQuestion([]));
    } catch (error) {
      console.log("error", error);
      toast.error("Lỗi khi lưu game!");
    } finally {
      setIsLoading(false);
    }
  }, [checkQuestionData, gameData, gameDispatch, gameState.listQuestions, navigate]);

  useEffect(() => {
    if (gameState.listQuestions?.length === 0) {
      handleAddQuestion();
    }
  }, [gameState.listQuestions, handleAddQuestion]);

  return (
    <div className='max-w-[1200px] w-[100%] h-full p-2'>
      <div className='header h-[80px] flex justify-between items-center'>
        <ButtonBack />
        {gameState.listQuestions?.length > 0 && (
          <div className='flex gap-2'>
            <Button isLoading={isLoading} onClick={handleSaveGame} className='text-center  bg-[#6B00E7] font-diablo'>
              Lưu lại
            </Button>
          </div>
        )}
      </div>
      <div
        style={{ animationDelay: "unset" }}
        className='fadeIn h-[calc(100%-100px)] mt-[20px] overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent'
      >
        <div className='font-diablo min-h-[50px] rounded-xl border-2 border-transparent gap-2 p-5 px-2 bg-[#466CF7A1] cursor-pointer border-b border-[#fff] transition-all duration-500 ease-in-out relative'>
          <div className='flex items-center gap-2 justify-center w-full flex-col'>
            <span className='border-b border-white pb-2'>Thông tin trò chơi</span>
            <span className='text-sm'>Hãy điền đầy đủ thông tin trò chơi của bạn để mọi người biết đến dễ dàng hơn!</span>
          </div>
          <div className='flex flex-col justify-center items-center gap-3 mt-5'>
            <Input
              value={gameData.name}
              onChange={(e) => handleChangeGameData("name", e.target.value)}
              className='text-center placeholder-white w-full max-w-[500px]'
              placeholder='Tên game'
            />
          </div>
        </div>
        <div className='flex flex-col gap-3 mt-5'>
          {gameState.listQuestions.map((question, index) => (
            <QuestionItem index={index + 1} key={index} question={question} />
          ))}
        </div>
        <div className='flex justify-center items-center gap-2 my-5'>
          <button
            onClick={handleAddQuestion}
            className='bg-none outline-none text-3xl  bg-[#6B00E7] hover:border-transparent font-diablo w-[60px] h-[60px] rounded-full p-0 flex items-center justify-center focus:outline-none hover:scale-[1.03] active:scale-[0.97] filter brightness-100 hover:brightness-110 transition-all duration-300 ease-in-out shadow-xl'
          >
            +
          </button>
        </div>
      </div>
      <ModalSaveGame />
    </div>
  );
};
export default CreateGamePage;
