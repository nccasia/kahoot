/* eslint-disable @typescript-eslint/no-explicit-any */
import Collapse from "@/components/Collapse";
import { IAddQuestionToGameDTO, IQuestion } from "@/interfaces/questionTypes";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import questionServices from "@/services/questionServices";
import GameActions from "@/stores/gameStore/gameAction";
import { useCallback, useContext, useState } from "react";
import { toast } from "react-toastify";
import QuestionContent from "./QuestionContent";

interface IQuestionItemProps {
  question: IQuestion;
  index?: number;
  handleUpdateQuestion: (question: IQuestion) => void;
  onOpenModalConfirmDeleteQuestion?: (questionId: string) => void;
  isEditing?: boolean;
  gameId: string;
}

const QuestionItem = ({
  question,
  index,
  onOpenModalConfirmDeleteQuestion,
  isEditing,
  gameId,
  handleUpdateQuestion,
}: IQuestionItemProps) => {
  const { gameState, gameDispatch } = useContext(GameContext);
  const [dataUpdate, setDataUpdate] = useState<IQuestion>(JSON.parse(JSON.stringify(question)));

  const handleChangeCollapse = (isOpen: boolean) => {
    if (gameState.isCreateQuestionOfGame) {
      toast.warning("Hãy lưu câu hỏi trước khi chọn câu hỏi khác!");
      return;
    }
    if (isOpen) {
      gameDispatch(GameActions.changeSelectedQuestion(question.id ?? ""));
      gameDispatch(GameActions.changeIsUpdateQuestionOfGame(false));
      setDataUpdate(JSON.parse(JSON.stringify(question)));
    }
  };

  const checkQuestionData = (question: IQuestion) => {
    const checkAnswerOptions = question.answerOptions.options.every((option) => option && option.trim() !== "");
    const checkTitle = question.title && question.title.trim() !== "";
    const checkCorrectIndex = question.answerOptions.correctIndex !== null && question.answerOptions.correctIndex >= 0;
    return checkAnswerOptions && checkTitle && checkCorrectIndex;
  };

  const handleConfirmSaveChange = async () => {
    gameDispatch(GameActions.changeIsSubmitting(true));
    try {
      if (!checkQuestionData(dataUpdate)) {
        toast.warning("Vui lòng điền đầy đủ thông tin câu hỏi!");
        return;
      }
      if (gameState.isCreateQuestionOfGame) {
        const dataCreate: IAddQuestionToGameDTO[] = [
          {
            mode: dataUpdate.mode,
            time: dataUpdate.time,
            title: dataUpdate.title,
            answerOptions: dataUpdate.answerOptions,
          },
        ];
        const response = await questionServices.addQuestion(gameId, dataCreate);
        if (!(response.statusCode === 200 || response.statusCode === 201)) {
          console.log("error", response);
          return;
        }
        toast.success("Thêm câu hỏi thành công!")!;
        gameDispatch(GameActions.changeIsCreateQuestionOfGame(false));
        gameDispatch(GameActions.changeIsUpdateQuestionOfGame(false));
        gameDispatch(GameActions.changeQuestionValue(dataUpdate));
        return;
      }

      // update question
      const response = await questionServices.updateQuestion(dataUpdate);
      if (response.statusCode !== 200) {
        console.log("error", response);
        return;
      }
      toast.success("Cập nhật câu hỏi thành công!")!;
      gameDispatch(GameActions.changeIsUpdateQuestionOfGame(false));
      gameDispatch(GameActions.changeQuestionValue(dataUpdate));
    } catch (error) {
      toast.error((error as any)?.response.data.data.message[0]);
    } finally {
      gameDispatch(GameActions.changeIsSubmitting(false));
    }
  };

  const handleCancelSaveChange = useCallback(() => {
    if (gameState.isCreateQuestionOfGame) {
      gameDispatch(GameActions.deleteQuestion(dataUpdate.id ?? ""));
      gameDispatch(GameActions.changeIsCreateQuestionOfGame(false));
      gameDispatch(GameActions.changeIsUpdateQuestionOfGame(false));
      return;
    }
    gameDispatch(GameActions.changeIsUpdateQuestionOfGame(false));
    setDataUpdate(JSON.parse(JSON.stringify(question)));
  }, [dataUpdate.id, gameDispatch, gameState.isCreateQuestionOfGame, question]);

  return (
    <div className='select-none'>
      <Collapse
        disabled={gameState.isCreateQuestionOfGame}
        hasError={question.isError}
        changeCollapse={handleChangeCollapse}
        open={question.id === gameState.selectedQuestion?.id}
        content={
          <QuestionContent
            isSubmitting={gameState.isSubmitting}
            onCanCelSaveChange={handleCancelSaveChange}
            onConfirmSaveChange={handleConfirmSaveChange}
            isEditing={isEditing}
            onOpenModalConfirmDeleteQuestion={onOpenModalConfirmDeleteQuestion}
            handleUpdateQuestion={handleUpdateQuestion}
            question={question}
            dataUpdate={dataUpdate}
            changeDataUpdate={setDataUpdate}
          />
        }
      >
        <div className='font-diablo text-start text-white line-clamp-2 min-h-[50px]'>
          <span className='mr-2'>Câu {index}:</span>
          <span>{question.title}</span>
        </div>
      </Collapse>
    </div>
  );
};
export default QuestionItem;
