import Button from "@/components/Button";
import Input from "@/components/Input";
import SelectDropdown from "@/components/SelectDropdown";
import { IQuestion } from "@/interfaces/questionTypes";
import { useRef } from "react";
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
  handleDeleteQuestion?: (questionId: string) => void;
}
const timeOptions: Array<{
  label: string;
  value: number;
}> = [
    { label: "15s", value: 15 },
    { label: "30s", value: 30 },
    { label: "45s", value: 45 },
    { label: "60s", value: 60 },
  ];
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

  const handleChangeTime = (option: { label: string; value: number | string }) => {
    const newQuestion = {
      ...dataUpdate,
      time: option.value as number,
    };
    changeDataUpdate(newQuestion);
  };

  const handleAddAnswer = () => {
    if (dataUpdate.answerOptions.options.length >= 4) return;
    const newQuestion = {
      ...dataUpdate,
      answerOptions: {
        ...dataUpdate.answerOptions,
        options: [...dataUpdate.answerOptions.options, ""],
      },
    };
    changeDataUpdate(newQuestion);
  };

  const handleDeleteAnswer = (index: number) => {
    if (dataUpdate.answerOptions.options.length <= 2) return;
    const newQuestion = {
      ...dataUpdate,
      answerOptions: {
        ...dataUpdate.answerOptions,
        options: dataUpdate.answerOptions.options.filter((_, i) => i !== index),
      },
    };
    if (
      newQuestion.answerOptions.correctIndex &&
      newQuestion.answerOptions.correctIndex >= newQuestion.answerOptions.options.length
    ) {
      newQuestion.answerOptions.correctIndex = null;
    }
    changeDataUpdate(newQuestion);
  };
  const handleDeleteImage = async () => {
    if (!dataUpdate.image) return;

    try {
      URL.revokeObjectURL(dataUpdate.image);

      const newQuestion = {
        ...dataUpdate,
        image: undefined,
        imageFile: undefined
      };

      changeDataUpdate(newQuestion);
      if (handleUpdateQuestion) handleUpdateQuestion(newQuestion);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Lỗi xóa ảnh:', error);
    }
  };
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      try {
        const newQuestion = {
          ...dataUpdate,
          image: URL.createObjectURL(file),
          imageFile: file,
        }; changeDataUpdate(newQuestion);
        if (handleUpdateQuestion) handleUpdateQuestion(newQuestion);
      } catch (error) {
        console.error("Lỗi upload ảnh:", error);
      }
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleAddImage = () => {
    fileInputRef.current?.click();
  };
  return (
    <div className='body p-2 font-coiny text-white'>
      <div className='flex flex-col gap-3'>
        {isEditing ? (
          <>
            <div className='flex flex-col items-start flex-wrap'>
              <div className='flex items-center w-full'>
                <span className='inline-block font-coiny min-w-[200px] text-start text-2xl'>Câu hỏi:</span>
                <Input
                  onChange={(e) => handleChange(e, 'title')}
                  value={dataUpdate.title}
                  className='flex-1 rounded-lg font-coiny'
                />
                <span
                  onClick={handleAddImage}
                  className='ml-7 w-[40px] h-[40px] flex items-center justify-center cursor-pointer hover:bg-green-500 transition-all rounded-full'
                >
                  <img className='w-[40px] h-[40px] filter brightness-0 invert' src='/icons/addimage2.png' alt='Add' />
                </span>
              </div>
              <input type='file' accept='image/*' ref={fileInputRef} className='hidden' onChange={handleImageUpload} />
              {dataUpdate.image && (
                <div className='relative mt-2 border-2 border-gray-100 rounded-md p-2 self-start'>
                  <img src={dataUpdate.image} className='w-auto h-[150px] object-cover rounded-md' />
                  <span
                    onClick={handleDeleteImage}
                    className='absolute top-[-5px] right-[-5px] w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-red-600 transition-all'
                  >
                    <img src='/icons/remove.png' />
                  </span>
                </div>
              )}
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
                  <div className='w-16 flex justify-end items-center'>
                    <span
                      onClick={() => handleDeleteAnswer(index)}
                      className='w-[40px] h-[40px] p-3 flex items-center justify-center bg-[#6B00E7] rounded-md cursor-pointer hover:bg-red-500 transition-all'
                    >
                      <img src='/icons/CloseIcon.png' />
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className='flex'>

              <div className='ml-[208px] flex gap-2'>
                <Button onClick={handleAddAnswer} className='bg-[#6B00E7] rounded-md min-w-[50px]'>
                  <img className='w-10' src='/icons/PlusIcon.png' />
                </Button>
                <SelectDropdown selectedValue={question.time} options={timeOptions} onSelect={handleChangeTime} />
              </div>
            </div>
          </>
        ) : (
          <div className='flex flex-col gap-2'>
            {question.image && (
              <div className='border-2 border-gray-100 rounded-md p-2 w-fit'>
                <img src={question.image} className='w-auto h-[150px] object-cover rounded-md' />
              </div>
            )}

            <div className='mt-2'>
              {question.answerOptions?.options.map((option, index) => (
                <div key={index} className='flex items-center flex-wrap gap-2 min-h-[30px] font-coiny'>
                  <span className='w-[50px] inline-block'>{index + 1}.</span>
                  <span className='flex-1 text-start'>{option}</span>
                  <span className='w-[50px] inline-block'>
                    {question.answerOptions?.correctIndex === index && (
                      <img className='w-[25px]' src='/icons/icon-checked.png' />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
