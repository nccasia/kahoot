import Button from "@/components/Button";
import Input from "@/components/Input";
import { IQuestion } from "@/interfaces/questionTypes";
interface IQuestionContentProps {
  question: IQuestion;
  handleUpdateQuestion: (question: IQuestion) => void;
  onOpenModalConfirmDeleteQuestion?: (questionId: string) => void;
  isEditing?: boolean;
  isSubmitting?: boolean;
  onCanCelSaveChange: () => void;
  onConfirmSaveChange: () => void;
  dataUpdate: IQuestion;
  changeDataUpdate: (data: IQuestion) => void;
}

const QuestionContent = ({
  question,
  onOpenModalConfirmDeleteQuestion,
  isEditing,
  isSubmitting,
  handleUpdateQuestion,
  onCanCelSaveChange,
  onConfirmSaveChange,
  dataUpdate,
  changeDataUpdate,
}: IQuestionContentProps) => {
  const handleOpenModalConfirmDeleteQuestion = () => {
    if (onOpenModalConfirmDeleteQuestion) onOpenModalConfirmDeleteQuestion(question.id ?? "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: string | number) => {
    const newQuestion = {
      ...dataUpdate,
    };
    if (typeof field === "string") {
      newQuestion.title = e.target.value;
    } else {
      newQuestion.answerOptions.options[field] = e.target.value;
    }
    changeDataUpdate(newQuestion);
  };

  const handleChangeCorrectAnswer = (index: number) => {
    const newQuestion = {
      ...dataUpdate,
    };
    newQuestion.answerOptions.correctIndex = index;
    changeDataUpdate(newQuestion);
  };

  return (
    <div className='body p-2 font-coiny text-white'>
      <div className='flex flex-col gap-3'>
        {isEditing ? (
          <>
            <div className='flex items-center flex-wrap'>
              <span className='inline-block font-coiny min-w-[200px] text-start text-2xl'>Câu hỏi:</span>
              <Input
                onChange={(e) => handleChange(e, "title")}
                value={dataUpdate.title}
                className='flex-1 rounded-lg font-coiny'
              />
            </div>
            <div className='flex flex-col gap-3 mt-2 pt-2 border-t-2 border-gray-100'>
              {dataUpdate.answerOptions?.options.map((option, index) => (
                <div key={index} className='flex items-center flex-wrap gap-1'>
                  <span className='inline-block font-coiny min-w-[200px] text-start text-2xl'>Đáp án {index + 1}:</span>
                  <div className='input-box flex-1 min-w-[300px] relative'>
                    <div
                      onClick={() => handleChangeCorrectAnswer(index)}
                      className='absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 flex w-[40px] rounded-lg h-full bg-[#1C0C8E] items-center justify-center'
                    >
                      <div className='absolute left-0 top-0 z-10 w-full h-full flex items-center justify-center'>
                        <div className={`w-5 h-5 border-white border-2 rounded-full flex items-center justify-center`}>
                          {dataUpdate.answerOptions.correctIndex === index && (
                            <span className='w-2 h-2 bg-white rounded-full block blur-[1px]'></span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Input
                      onChange={(e) => handleChange(e, index)}
                      value={option}
                      className='rounded-lg w-full pl-11 font-coiny'
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          question.answerOptions?.options.map((option, index) => (
            <div key={index} className='flex items-center flex-wrap gap-2 min-h-[30px] font-coiny '>
              <span className='w-[50px] inline-block'>{index + 1}.</span>
              <span className='flex-1 text-start'>{option}</span>
              <span className='w-[50px] inline-block'>
                {question.answerOptions?.correctIndex === index && <img className='w-[25px]' src='/icons/icon-checked.png' />}
              </span>
            </div>
          ))
        )}
      </div>
      {isEditing ? (
        <div className='flex justify-end gap-2 mt-5'>
          <Button onClick={onCanCelSaveChange} className='text-center bg-[#e93d3d] font-coiny text-lg '>
            Huỷ bỏ
          </Button>
          <Button isLoading={isSubmitting} onClick={onConfirmSaveChange} className='text-center bg-[#ded525] font-coiny text-lg '>
            Lưu thay đổi
          </Button>
        </div>
      ) : (
        <div className='flex justify-end gap-2 mt-5'>
          <Button onClick={() => handleUpdateQuestion(question)} className='text-center bg-[#ded525] font-coiny text-lg '>
            Chỉnh sửa
          </Button>
          <Button onClick={handleOpenModalConfirmDeleteQuestion} className='text-center bg-[#e93d3d] font-coiny text-lg '>
            Xoá câu hỏi
          </Button>
        </div>
      )}
    </div>
  );
};
export default QuestionContent;
