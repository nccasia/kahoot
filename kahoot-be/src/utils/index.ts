import { MAX_QUESTION_POINT, TIME_POINT_FACTOR } from '@constants';
import * as crypto from 'crypto';
export const generateRoomCode = () => {
  return ((Date.now() % 1000000) + Math.floor(Math.random() * 1000))
    .toString()
    .padStart(6, '0');
};

export const calculatePoint = (
  submitTime: Date,
  questionStartTime: Date,
  isCorrect: boolean,
) => {
  if (!isCorrect) return 0;
  const timeTaken = submitTime.getTime() - questionStartTime.getTime();
  if (timeTaken <= 0) return 0;
  const questionPoint = Math.max(
    100,
    MAX_QUESTION_POINT - timeTaken * TIME_POINT_FACTOR,
  );
  return Math.round(questionPoint);
};

export const Hasher = {
  HMAC_SHA256: (key: string | Buffer, data: string | Buffer) => {
    return crypto.createHmac('sha256', key).update(data).digest();
  },
  HEX: (data: Buffer) => {
    return data.toString('hex');
  },
};
