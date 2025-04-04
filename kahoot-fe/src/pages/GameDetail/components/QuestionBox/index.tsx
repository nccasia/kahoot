import { IQuestion } from "@/interfaces/questionTypes";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import GameActions from "@/stores/gameStore/gameAction";
import generateId from "@/utils/functions/generateId";
import { useCallback, useContext } from "react";
import { toast } from "react-toastify";
import QuestionItem from "../QuestionItem";

interface QuestionItemProps {
  questions: IQuestion[];
  gameId: string;
}
const QuestionBox = ({ questions, gameId }: QuestionItemProps) => {
  const { gameDispatch, gameState } = useContext(GameContext);

  const handleOpenModalConfirmDeleteQuestion = (questionId: string) => {
    gameDispatch(GameActions.changeSelectedQuestion(questionId));
    gameDispatch(GameActions.changeOpenModalConfirmDeleteQuestion(true));
  };

  const handleUpdateQuestion = useCallback(
    (question: IQuestion) => {
      console.log(question);
      gameDispatch(GameActions.changeIsUpdateQuestionOfGame(true));
      gameDispatch(GameActions.changeSelectedQuestion(question.id ?? ""));
      gameDispatch(GameActions.changeOldQuestionData(question));
    },
    [gameDispatch]
  );

  const handleAddQuestion = useCallback(() => {
    if (gameState.isCreateQuestionOfGame) {
      toast.warning("Có câu hỏi chưa lưu, vui lòng lưu câu hỏi trước khi thêm mới!");
      return;
    }
    const id = generateId(6, "mixed");
    const newQuestion: IQuestion = {
      id,
      mode: "single_choice",
      title: "",
      time: 30,
      answerOptions: {
        options: ["", "", "", ""],
        correctIndex: null,
        correctIndexes: null,
      },
    };
    gameDispatch(GameActions.addQuestion([newQuestion]));
    gameDispatch(GameActions.changeSelectedQuestion(id));
    gameDispatch(GameActions.changeIsCreateQuestionOfGame(true));
    gameDispatch(GameActions.changeIsUpdateQuestionOfGame(true));
  }, [gameDispatch, gameState.isCreateQuestionOfGame]);

  return (
    <div className='flex-1 p-4 flex gap-2 flex-col h-full overflow-y-auto [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-track]:bg-transparent'>
      {questions.map((question, index) => (
        <QuestionItem
          gameId={gameId}
          handleUpdateQuestion={handleUpdateQuestion}
          isEditing={gameState.isUpdateQuestionOfGame && gameState.selectedQuestion?.id === question.id}
          onOpenModalConfirmDeleteQuestion={handleOpenModalConfirmDeleteQuestion}
          key={question.id}
          question={question}
          index={index + 1}
        />
      ))}
      <div className='flex justify-center items-center gap-2 my-5'>
        <button
          onClick={handleAddQuestion}
          className='bg-none outline-none text-3xl  bg-[#6B00E7] hover:border-transparent font-coiny w-[60px] h-[60px] rounded-full p-0 flex items-center justify-center focus:outline-none hover:scale-[1.03] active:scale-[0.97] filter brightness-100 hover:brightness-110 transition-all duration-300 ease-in-out shadow-md shadow-blue-400'
        >
          +
        </button>
      </div>
    </div>
  );
};
export default QuestionBox;
