export enum EQuestionErrorTypes {
  INVALID_QUESTION = "INVALID_QUESTION",
  INVALID_ANSWER = "INVALID_ANSWER",
  INVALID_TEXT_ANSWER = "INVALID_TEXT_ANSWER",
  INVALID_CORRECT_INDEX = "INVALID_CORRECT_INDEX",
  INVALID_CORRECT_INDEXS = "INVALID_CORRECT_INDEXS",
  NO_ERROR = "NO_ERROR",
}

export const questionErrorTypes = {
  // [EQuestionErrorTypes.INVALID_QUESTION]: "Bạn chưa nhập nội dung câu hỏi",
  // [EQuestionErrorTypes.INVALID_ANSWER]: "Câu hỏi có đáp án đang bị trống",
  // [EQuestionErrorTypes.INVALID_TEXT_ANSWER]: "Bạn chưa nhập câu trả lời cho câu hỏi",
  // [EQuestionErrorTypes.INVALID_CORRECT_INDEX]: "Bạn chưa chọn đáp án đúng cho câu hỏi này",
  // [EQuestionErrorTypes.INVALID_CORRECT_INDEXS]: "Bạn chưa chọn đáp án đúng cho câu hỏi này",
  // [EQuestionErrorTypes.NO_ERROR]: "Câu hỏi đã đúng định dạng",
  [EQuestionErrorTypes.INVALID_QUESTION]:
    "You have not entered the question content",
  [EQuestionErrorTypes.INVALID_ANSWER]: "The question has an empty answer",
  [EQuestionErrorTypes.INVALID_TEXT_ANSWER]:
    "You have not entered an answer for the question",
  [EQuestionErrorTypes.INVALID_CORRECT_INDEX]:
    "You have not selected the correct answer for this question",
  [EQuestionErrorTypes.INVALID_CORRECT_INDEXS]:
    "You have not selected the correct answers for this question",
  [EQuestionErrorTypes.NO_ERROR]: "The question is in the correct format",
};
