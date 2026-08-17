const congratulationText = [
  // "Xin chúc mừng!",
  // "Chúc mừng!",
  // "Chúc mừng bạn!",
  // "Thật tuyệt vời!",
  // "Quá xuất sắc!",
  // "Đỉnh! Đỉnh! Đỉnh!",
  // "Xin là xin chúc mừng bạn!",
  // "Quá dễ!",
  "Congratulations!",
  "Well done!",
  "Great job!",
  "Awesome!",
  "Fantastic!",
  "Excellent!",
  "You nailed it!",
  "So easy for you!",
  "You are amazing!",
  "You are a genius!",
  "You are the best!",
  "You are unstoppable!",
  "You are on fire!",
  "You are a rockstar!",
  "You are a legend!",
  "You are a superstar!",
  "You are a champion!",
  "You are a winner!",
  "You are unbeatable!",
];

const errorText = [
  // "Sai mất tiu rồi!",
  // "Ohh nooo!",
  // "Haizzz!",
  // "Thật không thể tin được!",
  // "Không thể chấp nhận được!",
  "You made a mistake!",
  "Oh no!",
  "Oops!",
  "That's incorrect!",
  "Wrong answer!",
  "Not quite right!",
  "Try again!",
  "Keep trying!",
  "Don't give up!",
  "Almost there!",
  "Not your best moment!",
  "Better luck next time!",
  "You can do better!",
];

const correctAnswerText = [
  // "Bạn đã trả lời đúng!",
  // "Mang câu khó hơn đến đây nào!",
  // "Quá nhanh quá nguy hiểm!",
  // "Khó vậy mà bạn cũng trả lời đúng!",
  "You got it right!",
  "Correct answer!",
  "That's the right answer!",
  "You nailed it!",
  "Spot on!",
  "You hit the nail on the head!",
  "You answered correctly!",
  "You are correct!",
  "You are right!",
  "You are on point!",
  "You are spot on!",
];

const wrongAnswerText = [
  // "Bạn đã trả lời sai mất rồi!",
  // "Hãy cố gắng hơn nữa bạn nhé!",
  // "Top 1 vẫn đang chờ bạn đấy!",
  // "Bạn đã trả lời sai rồi!",
  // "Không sao, câu này khó",
  "You answered incorrectly!",
  "That's not the right answer!",
  "You missed it!",
  "Wrong choice!",
  "Not the correct answer!",
  "You got it wrong!",
  "That's not it!",
  "You made a mistake!",
  "You chose the wrong answer!",
];

const waitingAnswerText = [
  // "Chờ xíu nha! \n Mọi người đang suy nghĩ câu trả lời!",
  // "Đừng vội, mọi người đang suy nghĩ!",
  // "Bạn trả lời nhanh đấy, chờ xíu nha!",
  // "Quá nhanh, quá nguy hiểm! Mọi người đang suy nghĩ mà!",
  // "Chờ xíu nha! Đáp án sắp được công bố!",
  // "Ú oà! Chờ xem đáp án là gì nào!",
  // "Câu trả lời sẽ xuất hiện trong giây lát!",
  "Please wait! \n Everyone is thinking about the answer!",
  "Don't rush, everyone is thinking!",
  "You answered quickly, please wait a moment!",
  "Too fast, too dangerous! Everyone is thinking!",
  "Please wait! The answer will be revealed soon!",
  "Oh wow! Let's wait and see what the answer is!",
  "The answer will appear in a moment!",
  "Hold on! \n The answer is coming up soon!",
  "Just a moment! \n The answer will be revealed shortly!",
  "Hang tight! \n The answer is on its way!",
  "Just a second! \n The answer will be shown soon!",
  "Please hold on! \n The answer is coming up!",
  "Wait a bit! \n The answer will be revealed shortly!",
  "Just a little patience! \n The answer is coming soon!",
  "Almost there! \n The answer will be shown soon!",
];

const startQuestionText = [
  // "Đã bắt đầu câu hỏi mới! \n Nhanh tay trả lời nào bạn ơi!",
  // "Câu hỏi mới đã xuất hiện! \n Trả lời nhanh thôi!",
  // "Top 1 đang chờ bạn đấy! \n Nhanh tay trả lời nào!",
  // "Câu hỏi mới đã được công bố! \n Bạn đã sẵn sàng chưa?",
  // "Nhanh tay trả lời câu hỏi nào bạn ơi!",
  // "Càng nhanh càng tốt! \n Bắt đầu câu hỏi mới thôi!",
  // "Khó quá thì trả lời đại đi bạn ơi!",
  "A new question has started! \n Hurry up and answer!",
  "A new question has appeared! \n Answer quickly!",
  "Top 1 is waiting for you! \n Hurry up and answer!",
  "A new question has been announced! \n Are you ready?",
  "Hurry up and answer the question!",
  "The faster, the better! \n Let's start a new question!",
  "If it's too hard, just answer randomly!",
  "A new question is here! \n Let's see if you can answer it!",
  "Get ready for a new question! \n Let's see how fast you can answer!",
  "A new question is waiting for you! \n Let's see if you can get it right!",
  "A new question is up! \n Let's see if you can answer it quickly!",
  "A new question is ready! \n Let's see if you can answer it correctly!",
  "A new question is live! \n Let's see if you can answer it right!",
  "A new question is on! \n Let's see if you can answer it fast!",
  "A new question is happening! \n Let's see if you can answer it in time!",
  "A new question is starting! \n Let's see if you can answer it before time runs out!",
];

const randomResultAnswerText = (
  type: "congratulation" | "error" | "correct" | "wrong" | "waiting" | "start"
) => {
  switch (type) {
    case "congratulation":
      return congratulationText[
        Math.floor(Math.random() * congratulationText.length)
      ];
    case "error":
      return errorText[Math.floor(Math.random() * errorText.length)];
    case "correct":
      return correctAnswerText[
        Math.floor(Math.random() * correctAnswerText.length)
      ];
    case "wrong":
      return wrongAnswerText[
        Math.floor(Math.random() * wrongAnswerText.length)
      ];
    case "waiting":
      return waitingAnswerText[
        Math.floor(Math.random() * waitingAnswerText.length)
      ];
    case "start":
      return startQuestionText[
        Math.floor(Math.random() * startQuestionText.length)
      ];
    default:
      return "";
  }
};
export default randomResultAnswerText;
