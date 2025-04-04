import Button from "@/components/Button";
import Input from "@/components/Input";
import SelectDropdown from "@/components/SelectDropdown";
import { EQuestionTypes, questionTypeOptions } from "@/constants/QuestionTypes";
import { IQuestion } from "@/interfaces/questionTypes";
import { useRef, useState } from "react";
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
    if (typeof field === "string") {
      const newQuestion = { ...dataUpdate, [field]: e.target.value };
      console.log("newQuestion", newQuestion);
      changeDataUpdate(newQuestion);
    } else {
      const newOptions = [...dataUpdate.answerOptions.options];
      newOptions[field] = e.target.value;
      const newQuestion = {
        ...dataUpdate,
        answerOptions: {
          ...dataUpdate.answerOptions,
          options: newOptions,
        },
      };
      console.log("newQuestion", newQuestion);
      changeDataUpdate(newQuestion);
    }
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

    const newOptions = dataUpdate.answerOptions.options.filter((_, i) => i !== index);
    let newCorrectIndex = dataUpdate.answerOptions.correctIndex;
    if (newCorrectIndex !== null) {
      if (newCorrectIndex === index) {
        newCorrectIndex = 0;
      } else if (newCorrectIndex > index) {
        newCorrectIndex -= 1;
      }

    }

    const newQuestion = {
      ...dataUpdate,
      answerOptions: {
        ...dataUpdate.answerOptions,
        options: newOptions,
        correctIndex: newCorrectIndex,
      },
    };
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
  const handleChangeQuestionType = (option: { label: string; value: string | number }) => {
    const newAnswerOptions = { ...dataUpdate.answerOptions };
    let newAnswerText = dataUpdate.answerText;

    if (option.value === EQuestionTypes.SINGLE_CHOICE) {
      newAnswerOptions.correctIndex = newAnswerOptions.correctIndex ?? null;
      newAnswerOptions.correctIndexes = []
      newAnswerText = "";
    } else if (option.value === EQuestionTypes.MULTIPLE_CHOICE) {
      newAnswerOptions.correctIndexes = newAnswerOptions.correctIndexes || [];
      newAnswerOptions.correctIndex = null
      newAnswerText = "";
    } else if (option.value === EQuestionTypes.TEXT) {
      newAnswerText = dataUpdate.answerText || "";
      newAnswerOptions.correctIndexes = []
      newAnswerOptions.correctIndex = null
    }

    const newQuestion = {
      ...dataUpdate,
      mode: option.value as string,
      answerOptions: newAnswerOptions,
      answerText: newAnswerText,
    };

    changeDataUpdate(newQuestion);
    if (handleUpdateQuestion) handleUpdateQuestion(newQuestion);
  };





  const handleToogleCorrectAnswerOfMultipleChoiceQuestion = (index: number) => {
    const newQuestion = {
      ...dataUpdate,
    };
    if (newQuestion.answerOptions?.correctIndexes) {
      if (newQuestion.answerOptions.correctIndexes?.includes(index)) {
        newQuestion.answerOptions.correctIndexes = newQuestion.answerOptions.correctIndexes.filter((i) => i !== index);
      } else {
        newQuestion.answerOptions.correctIndexes.push(index);
      }
    } else {
      newQuestion.answerOptions.correctIndexes = [index];
    }
    if (dataUpdate.isError) {
      newQuestion.isError = !checkQuestionData(newQuestion);
    }
    if (handleUpdateQuestion) handleUpdateQuestion(newQuestion);
  };
  const checkQuestionData = (dataUpdate: IQuestion) => {
    const checkAnswerOptions =
      dataUpdate.mode !== EQuestionTypes.TEXT
        ? dataUpdate.answerOptions.options.every((option) => option && option.trim() !== "")
        : true;
    const checkAnswerIndexes =
      dataUpdate.mode === EQuestionTypes.MULTIPLE_CHOICE
        ? dataUpdate.answerOptions.correctIndexes && dataUpdate.answerOptions.correctIndexes.length > 0
        : true;
    const checkTitle = dataUpdate.title && dataUpdate.title.trim() !== "";
    const checkAnswerText =
      dataUpdate.mode === EQuestionTypes.TEXT
        ? dataUpdate?.answerText && dataUpdate.answerText.trim() !== ""
        : true;
    const checkCorrectIndex =
      dataUpdate.mode === EQuestionTypes.SINGLE_CHOICE
        ? dataUpdate.answerOptions.correctIndex !== null && dataUpdate.answerOptions.correctIndex >= 0
        : true;
    console.log(checkAnswerOptions, checkAnswerIndexes, checkTitle, checkAnswerText, checkCorrectIndex);

    return checkAnswerOptions && checkAnswerText && checkAnswerIndexes && checkTitle && checkCorrectIndex;
  };


  const [textValue, setTextValue] = useState<string>("");
  const handleFocus = (field: string | number) => {
    if (typeof field === "string") {
      setTextValue(dataUpdate[field as keyof IQuestion] as string);
    } else {
      setTextValue(dataUpdate.answerOptions?.options[field]);
    }
  };
  const handleBlur = (field: string | number) => {
    if (!dataUpdate) return;
    if (typeof field === "string") {
      const newQuestion = { ...dataUpdate, [field]: textValue };
      if (dataUpdate.isError) {
        newQuestion.isError = !checkQuestionData(newQuestion);
      }
      console.log("newQuestion", newQuestion);
      if (handleUpdateQuestion) handleUpdateQuestion(newQuestion);
    } else {
      const newOptions = [...dataUpdate.answerOptions.options];
      newOptions[field] = textValue;
      const newQuestion = {
        ...dataUpdate,
        answerOptions: {
          ...dataUpdate.answerOptions,
          options: newOptions,
        },
      };
      if (dataUpdate.isError) {
        newQuestion.isError = !checkQuestionData(newQuestion);
      }
      console.log("newQuestion", newQuestion);
      if (handleUpdateQuestion) handleUpdateQuestion(newQuestion);
    }
  };



  // ======================================================================================================================
  return (
    <div className='body p-2 font-coiny text-white'>
      <div className='flex flex-col gap-3'>
        {isEditing ? (
          <>
            <div className='flex flex-col items-start flex-wrap '>
              <div className='flex flex-col gap-2 w-full '>
                <span className='inline-block font-coiny min-w-[200px] text-start text-2xl'>Câu hỏi:</span>
                <Input
                  onChange={(e) => handleChange(e, 'title')}
                  value={dataUpdate.title}
                  className='flex-1 rounded-lg font-coiny'
                />
                <div className=' w-full flex justify-between' >
                  <span
                    onClick={handleAddImage}
                    className='ml-2 w-[50px] h-[50px] flex items-center justify-center cursor-pointer hover:bg-green-600 transition-all rounded-full border border-white'
                  >
                    <img className='w-[30px] h-[30px] filter brightness-0 invert' src='/icons/addimage2.png' alt='Add' />
                    <input type='file' accept='image/*' ref={fileInputRef} className='hidden' onChange={handleImageUpload} />
                  </span>
                  <div className="min-w-[300px]">
                    <SelectDropdown
                      dropdownPosition='bottom'
                      selectedValue={dataUpdate.mode}
                      options={questionTypeOptions}
                      onSelect={handleChangeQuestionType}
                    />

                  </div>

                </div>

              </div>
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
              {
                dataUpdate.mode === EQuestionTypes.TEXT ? (
                  <div className='flex items-center flex-wrap gap-1'>
                    <span className='inline-block min-w-[195px] text-start text-2xl'>Đáp án :</span>
                    <div className='input-box flex-1 min-w-[300px] relative'>
                      <Input
                        onFocus={() => handleFocus("answerText")}
                        onBlur={() => handleBlur("answerText")}
                        onChange={(e) => handleChange(e, 'answerText')}
                        value={dataUpdate.answerText}
                        className='rounded-lg w-full '
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {dataUpdate.answerOptions?.options.map((option, index) => (
                      <div key={index} className='flex items-center flex-wrap gap-1'>
                        <span className='inline-block min-w-[200px] text-start text-2xl'>Đáp án {index + 1}:</span>
                        <div className='input-box flex-1 min-w-[300px] relative'>
                          {dataUpdate.mode === EQuestionTypes.SINGLE_CHOICE ? (
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
                          ) : (
                            <div
                              onClick={() => handleToogleCorrectAnswerOfMultipleChoiceQuestion(index)}
                              className='absolute cursor-pointer left-0 top-1/2 -translate-y-1/2 flex w-[40px] rounded-lg h-full bg-[#1C0C8E] items-center justify-center'
                            >
                              <div className='absolute left-0 top-0 z-10 w-full h-full flex items-center justify-center'>
                                <div className={`w-5 h-5 border-white border-2 rounded-sm flex items-center justify-center`}>
                                  {dataUpdate.answerOptions.correctIndexes?.includes(index) && (
                                    <span className='w-2 h-2 bg-white rounded-full block blur-[1px]'></span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          <Input
                            onFocus={() => handleFocus(index)}
                            onBlur={() => handleBlur(index)}
                            onChange={(e) => handleChange(e, index)}
                            value={option}
                            className='rounded-lg w-full pl-11'
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
                  </>
                )
              }

            </div>
            <div className='flex'>

              <div className='ml-[208px] flex gap-2'>

                {dataUpdate.mode !== EQuestionTypes.TEXT && (<Button onClick={handleAddAnswer} className='bg-[#6B00E7] rounded-md min-w-[50px]'>
                  <img className='w-10' src='/icons/PlusIcon.png' />
                </Button>)}<SelectDropdown selectedValue={dataUpdate.time} options={timeOptions} onSelect={handleChangeTime} />

              </div>
            </div>
          </>
        ) : (
          <div className='mt-2'>
            <div>
              {dataUpdate.image && (
                <div className='border-2 border-gray-100 rounded-md p-2 w-fit'>
                  <img src={dataUpdate.image} className='w-auto h-[150px] object-cover rounded-md' />
                </div>
              )}

            </div>

            {dataUpdate.mode === EQuestionTypes.TEXT ? (
              <div className='flex items-center flex-wrap gap-2 min-h-[30px] font-coiny'>
                <span className='flex-1 text-start'>{dataUpdate.answerText || "Chưa có đáp án"}</span>
              </div>
            ) : (
              dataUpdate.answerOptions?.options.map((option, index) => (
                <div key={index} className='flex items-center flex-wrap gap-2 min-h-[30px] font-coiny'>
                  <span className='w-[50px] inline-block'>{index + 1}.</span>
                  <span className='flex-1 text-start'>{option}</span>
                  <span className='w-[50px] inline-block'>
                    {dataUpdate.mode === EQuestionTypes.MULTIPLE_CHOICE ? (
                      dataUpdate.answerOptions.correctIndexes?.includes(index) && (
                        <img className='w-[25px]' src='/icons/icon-checked.png' alt='Checked' />
                      )
                    ) : (
                      dataUpdate.mode === EQuestionTypes.SINGLE_CHOICE && dataUpdate.answerOptions.correctIndex === index && (
                        <img className='w-[25px]' src='/icons/icon-checked.png' alt='Checked' />
                      )
                    )}
                  </span>
                </div>
              ))
            )}

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
