export enum EQuestionTypes {
  SINGLE_CHOICE = "single_choice",
  MULTIPLE_CHOICE = "multiple_choice",
  TEXT = "text",
}

export const questionTypeOptions = [
  {
    label: "Câu hỏi một lựa chọn",
    value: EQuestionTypes.SINGLE_CHOICE,
  },
  {
    label: "Câu hỏi nhiều lựa chọn",
    value: EQuestionTypes.MULTIPLE_CHOICE,
  },
  {
    label: "Câu hỏi nhập văn bản",
    value: EQuestionTypes.TEXT,
  },
];

export const questionImportTypes = {
  [EQuestionTypes.SINGLE_CHOICE]: "SINGLE",
  [EQuestionTypes.MULTIPLE_CHOICE]: "MULTIPLE",
  [EQuestionTypes.TEXT]: "TEXT"
}