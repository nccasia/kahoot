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

  const checkQuestionData = (dataUpdate: IQuestion) => {
    console.log('question', dataUpdate);

    // Kiểm tra các tùy chọn trả lời có hợp lệ không (không rỗng và không chỉ chứa khoảng trắng)
    const checkAnswerOptions = dataUpdate.answerOptions.options.every(
      (option) => option && option.trim() !== ""
    );

    // Kiểm tra tiêu đề câu hỏi có hợp lệ không (không rỗng và không chỉ chứa khoảng trắng)
    const checkTitle = dataUpdate.title && dataUpdate.title.trim() !== "";

    // Kiểm tra correctIndex hoặc correctIndexes tùy theo loại câu hỏi
    let checkCorrectIndex = false;

    if (dataUpdate.mode === 'SingleChoice') {
      // Nếu là SingleChoice, kiểm tra correctIndex không nhỏ hơn 0 và hợp lệ
      checkCorrectIndex =
        dataUpdate.answerOptions.correctIndex !== null &&
        dataUpdate.answerOptions.correctIndex < dataUpdate.answerOptions.options.length;
    } else if (dataUpdate.mode === 'MultipleChoice') {
      checkCorrectIndex =
        Array.isArray(dataUpdate.answerOptions.correctIndex) &&
        dataUpdate.answerOptions.correctIndex.length > 0 && // ✅ Phải có ít nhất 1 giá trị
        dataUpdate.answerOptions.correctIndex.every(
          (index) => index >= 0 && index < dataUpdate.answerOptions.options.length
        );
    }
    else {
      checkCorrectIndex = true;
    }

    console.log(checkAnswerOptions, checkTitle, checkCorrectIndex);
    return checkAnswerOptions && checkTitle && checkCorrectIndex;
  };

  const handleConfirmSaveChange = async () => {
    gameDispatch(GameActions.changeIsSubmitting(true));
    try {
      if (!checkQuestionData(dataUpdate)) {
        toast.warning("Vui lòng điền đầy đủ thông tin câu hỏi !");
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
        <div className='font-coiny text-start text-white text-lg line-clamp-2 min-h-[50px]'>
          <span className='mr-2'>Câu {index}:</span>
          <span>{question.title}</span>
        </div>
      </Collapse>
    </div>
  );
};
export default QuestionItem;
