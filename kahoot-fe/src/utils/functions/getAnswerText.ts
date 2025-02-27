const congratulationText = [
  "Xin chúc mừng!",
  "Chúc mừng!",
  "Chúc mừng bạn!",
  "Thật tuyệt vời!",
  "Quá xuất sắc!",
  "Đỉnh! Đỉnh! Đỉnh!",
  "Xin là xin chúc mừng bạn!",
  "Quá dễ!",
];

const errorText = ["Sai mất tiu rồi!", "Ohh nooo!", "Haizzz!", "Thật không thể tin được!", "Không thể chấp nhận được!"];

const correctAnswerText = [
  "Bạn đã trả lời đúng!",
  "Mang câu khó hơn đến đây nào!",
  "Quá nhanh quá nguy hiểm!",
  "Khó vậy mà bạn cũng trả lời đúng!",
];

const wrongAnswerText = [
  "Bạn đã trả lời sai mất rồi!",
  "Hãy cố gắng hơn nữa bạn nhé!",
  "Top 1 vẫn đang chờ bạn đấy!",
  "Bạn đã trả lời sai rồi!",
  "Không sao, câu này khó",
];

const waitingAnswerText = [
  "Chờ xíu nha! \n Mọi người đang suy nghĩ câu trả lời!",
  "Đừng vội, mọi người đang suy nghĩ!",
  "Bạn trả lời nhanh đấy, chờ xíu nha!",
  "Quá nhanh, quá nguy hiểm! Mọi người đang suy nghĩ mà!",
  "Chờ xíu nha! Đáp án sắp được công bố!",
  "Ú oà! Chờ xem đáp án là gì nào!",
  "Câu trả lời sẽ xuất hiện trong giây lát!",
];

const startQuestionText = [
  "Đã bắt đầu câu hỏi mới! \n Nhanh tay trả lời nào bạn ơi!",
  "Câu hỏi mới đã xuất hiện! \n Trả lời nhanh thôi!",
  "Top 1 đang chờ bạn đấy! \n Nhanh tay trả lời nào!",
  "Câu hỏi mới đã được công bố! \n Bạn đã sẵn sàng chưa?",
  "Nhanh tay trả lời câu hỏi nào bạn ơi!",
  "Càng nhanh càng tốt! \n Bắt đầu câu hỏi mới thôi!",
  "Khó quá thì trả lời đại đi bạn ơi!",
];

const randomResultAnswerText = (type: "congratulation" | "error" | "correct" | "wrong" | "waiting" | "start") => {
  switch (type) {
    case "congratulation":
      return congratulationText[Math.floor(Math.random() * congratulationText.length)];
    case "error":
      return errorText[Math.floor(Math.random() * errorText.length)];
    case "correct":
      return correctAnswerText[Math.floor(Math.random() * correctAnswerText.length)];
    case "wrong":
      return wrongAnswerText[Math.floor(Math.random() * wrongAnswerText.length)];
    case "waiting":
      return waitingAnswerText[Math.floor(Math.random() * waitingAnswerText.length)];
    case "start":
      return startQuestionText[Math.floor(Math.random() * startQuestionText.length)];
    default:
      return "";
  }
};
export default randomResultAnswerText;
