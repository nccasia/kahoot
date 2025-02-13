import { MAX_QUESTION_POINT, TIME_POINT_FACTOR } from '@constants';

export const generateRoomCode = () => {
  return ((Date.now() % 1000000) + Math.floor(Math.random() * 1000))
    .toString()
    .padStart(6, '0');
};

export const calculatePoint = (
  submitTime: Date,
  questionEndtime: Date,
  isCorrect: boolean,
) => {
  if (!isCorrect) return 0;
  const timeTaken = questionEndtime.getTime() - submitTime.getTime();
  if (timeTaken <= 0) return 0;
  const questionPoint = Math.max(
    0,
    MAX_QUESTION_POINT - timeTaken * TIME_POINT_FACTOR,
  );
  return Math.round(questionPoint);
};
