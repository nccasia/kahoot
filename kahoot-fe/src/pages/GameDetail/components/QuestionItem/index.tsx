/* eslint-disable @typescript-eslint/no-explicit-any */
import Collapse from "@/components/Collapse";
import { EQuestionErrorTypes, questionErrorTypes } from '@/constants/QuestionErrorTypes';
import { EQuestionTypes } from "@/constants/QuestionTypes";
import { IAddQuestionToGameDTO, IQuestion } from "@/interfaces/questionTypes";
import { GameContext } from "@/providers/ContextProvider/GameProvider";
import questionServices from "@/services/questionServices";
import uploadService from "@/services/uploadService";
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

  const [dataUpdate, setDataUpdate] = useState<IQuestion>({
    ...JSON.parse(JSON.stringify(question)),
    answerOptions: {
      options: question.answerOptions?.options || [],
      correctIndex: question.mode === EQuestionTypes.SINGLE_CHOICE ? question.answerOptions?.correctIndex ?? null : null,
      correctIndexes: question.mode === EQuestionTypes.MULTIPLE_CHOICE ? question.answerOptions?.correctIndexes || [] : [],
    },
  });

  const handleChangeCollapse = (isOpen: boolean) => {
    if (gameState.isCreateQuestionOfGame) {
      toast.warning("Hãy lưu câu hỏi trước khi chọn câu hỏi khác!");
      return;
    }
    if (isOpen) {
      gameDispatch(GameActions.changeSelectedQuestion(question.id ?? ""));
      gameDispatch(GameActions.changeIsUpdateQuestionOfGame(false));
      setDataUpdate({
        ...JSON.parse(JSON.stringify(question)),
        answerOptions: {
          options: question.answerOptions?.options || [],
          correctIndex: question.mode === EQuestionTypes.SINGLE_CHOICE ? question.answerOptions?.correctIndex ?? null : null,
          correctIndexes: question.mode === EQuestionTypes.MULTIPLE_CHOICE ? question.answerOptions?.correctIndexes || [] : [],
        },
      });
    }
  };

  const checkQuestionData = (dataUpdate: IQuestion) => {
    const checkAnswerOptions =
      dataUpdate.mode !== EQuestionTypes.TEXT
        ? dataUpdate.answerOptions.options.every((option) => option && option.trim() !== "")
        : true;
    if(!checkAnswerOptions) {
      return EQuestionErrorTypes.INVALID_ANSWER
    }

    const checkAnswerIndexes =
      dataUpdate.mode === EQuestionTypes.MULTIPLE_CHOICE
        ? dataUpdate.answerOptions.correctIndexes && dataUpdate.answerOptions.correctIndexes.length > 0
        : true;
    if(!checkAnswerIndexes) {
      return EQuestionErrorTypes.INVALID_CORRECT_INDEXS
    }
    
    const checkTitle = dataUpdate.title && dataUpdate.title.trim() !== "";
    if(!checkTitle) {
      return EQuestionErrorTypes.INVALID_QUESTION
    }

    const checkAnswerText =
      dataUpdate.mode === EQuestionTypes.TEXT ? dataUpdate?.answerText && dataUpdate.answerText?.trim() !== "" : true;
    if(!checkAnswerText) {
      return EQuestionErrorTypes.INVALID_TEXT_ANSWER
    }

    const checkCorrectIndex =
      dataUpdate.mode === EQuestionTypes.SINGLE_CHOICE
        ? dataUpdate.answerOptions.correctIndex !== null &&
        dataUpdate.answerOptions.correctIndex >= 0 &&
        dataUpdate.answerOptions.correctIndex < dataUpdate.answerOptions.options.length
        : true;
    if(!checkCorrectIndex) {
      return EQuestionErrorTypes.INVALID_CORRECT_INDEX
    }

    return EQuestionErrorTypes.NO_ERROR
  };

  const handleConfirmSaveChange = async () => {
    gameDispatch(GameActions.changeIsSubmitting(true));
    try {
      if (checkQuestionData(dataUpdate) !== EQuestionErrorTypes.NO_ERROR) {
        toast.warning(questionErrorTypes[checkQuestionData(dataUpdate)])
        return;
      }

      if (dataUpdate.imageFile) {
        const uploadImageResponse = await uploadService.uploadAnImage(dataUpdate.imageFile);
        if (uploadImageResponse.statusCode !== 200) {
          toast.error("Lỗi khi tải ảnh lên!");
          return;
        }
        dataUpdate.image = uploadImageResponse.data.secure_url;
      }

      if (gameState.isCreateQuestionOfGame) {
        const dataCreate: IAddQuestionToGameDTO[] = [
          {
            mode: dataUpdate.mode,
            time: dataUpdate.time,
            title: dataUpdate.title,
            answerOptions: dataUpdate.answerOptions,
            image: dataUpdate.image,
            answerText: dataUpdate.answerText,
          },
        ];
        const response = await questionServices.addQuestion(gameId, dataCreate);
        if (!(response.statusCode === 200 || response.statusCode === 201)) {
          return;
        }
        toast.success("Thêm câu hỏi thành công!");
        gameDispatch(GameActions.changeIsCreateQuestionOfGame(false));
        gameDispatch(GameActions.changeIsUpdateQuestionOfGame(false));
        gameDispatch(GameActions.changeQuestionValue(dataUpdate));
        return;
      }

      const response = await questionServices.updateQuestion(dataUpdate);
      if (response.statusCode !== 200) {
        return;
      }
      toast.success("Cập nhật câu hỏi thành công!");
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
    setDataUpdate({
      ...JSON.parse(JSON.stringify(question)),
      answerOptions: {
        options: question.answerOptions?.options || [],
        correctIndex: question.mode === EQuestionTypes.SINGLE_CHOICE ? question.answerOptions?.correctIndex ?? null : null,
        correctIndexes: question.mode === EQuestionTypes.MULTIPLE_CHOICE ? question.answerOptions?.correctIndexes || [] : [],
      },
    });
  }, [dataUpdate.id, gameDispatch, gameState.isCreateQuestionOfGame, question]);

  return (
    <div className='select-none'>
      <Collapse
        disabled={gameState.isCreateQuestionOfGame}
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
