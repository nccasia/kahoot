import Button from "@/components/Button";
import ButtonBack from "@/components/ButtonBack";
import { IQuestion } from "@/interfaces/questionTypes";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import GameActions from "@/stores/gameStore/gameAction";
import generateId from "@/utils/functions/generateId";
import { useContext } from "react";
import { toast } from "react-toastify";
import QuestionItem from "./components/QuestionItem";

const CreateGamePage = () => {
  const { gameState, gameDispatch } = useContext(GameContext);
  const handleAddQuestion = () => {
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
  };
  const checkQuestionData = () => {
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
  };
  const handleSaveGame = () => {
    const check = checkQuestionData();
    if (!check) {
      toast.error("Hãy kiểm tra lại thông tin câu hỏi!");
      return;
    }
  };
  return (
    <div className='max-w-[1200px] w-[100%] h-full p-2'>
      <div className='header h-[80px] flex justify-between items-center'>
        <ButtonBack />
        {gameState.listQuestions?.length > 0 && (
          <div className='flex gap-2'>
            <Button onClick={handleAddQuestion} className='text-center  bg-[#6c2cb6] font-diablo'>
              Thêm câu hỏi
            </Button>
            <Button onClick={handleSaveGame} className='text-center  bg-[#6B00E7] font-diablo'>
              Lưu lại
            </Button>
          </div>
        )}
      </div>
      <div
        style={{ animationDelay: "unset" }}
        className='fadeIn h-[calc(100%-100px)] mt-[20px] flex flex-col gap-3 overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent'
      >
        {gameState.listQuestions?.length > 0 ? (
          gameState.listQuestions.map((question, index) => <QuestionItem index={index + 1} key={index} question={question} />)
        ) : (
          <div className='h-full flex items-center justify-center flex-col gap-5'>
            <h1 className='text-white text-3xl font-diablo'>Chưa có câu hỏi nào được thêm</h1>
            <Button onClick={handleAddQuestion} className='text-center  bg-[#6c2cb6] font-diablo'>
              Thêm câu hỏi
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
export default CreateGamePage;
