export enum Table {
  User = 'users',
  Game = 'games',
  Question = 'questions',
  Room = 'rooms',
  RoomUser = 'room_users',
  RoomQuestion = 'room_questions',
  QuestionRoomUser = 'question_room_users',
}

export const GLOBAL_PREFIX = 'v1';
export const NAME_SPACE_JOIN_GAME = 'QUIZ';
export const MAX_QUESTION_OPTIONS = 4;
export const RECONNECT_WAIT_TIME = 3; // second
export const WAIT_TIME_PER_QUESTION = 10; // seconds
export const MAX_QUESTION_POINT = 1000;
export const MAX_REDIS_CACHE_TIME = 60 * 60 * 24 * 7; // 7 days
export const TIME_POINT_FACTOR = 0.025; // Rate of decrease in points per millisecond
export const RANKED_TOP = 3;
export const CACHES = {
  SOCKET: {
    key: (userId: string) => `socket:${userId}`,
    // ? TODO
    // ttl:
  },

  CURRENT_QUESTION: {
    getKey: (roomId: string) => `ROOM_QUESTION:${roomId}`,
    exprieTime: (time: number) => time + RECONNECT_WAIT_TIME - 1,
  },

  ROOM_STATUS: {
    getKey: (roomId: string) => `ROOM_STATUS:${roomId}`,
    exprieTime: MAX_REDIS_CACHE_TIME,
  },

  ROOM_GAME: {
    getKey: (roomId: string) => `ROOM_GAME:${roomId}`,
    exprieTime: MAX_REDIS_CACHE_TIME,
  },

  ROOM_QUESTION: {
    getKey: (roomId: string) => `ROOM_FINISHED_QUESTION:${roomId}`,
    exprieTime: MAX_REDIS_CACHE_TIME,
  },

  ROOM_QUESTION_TIME: {
    getKey: (roomId: string, questionId: string) =>
      `ROOM_TIME:${roomId}:${questionId}`,
    exprieTime: (time: number) => time,
  },

  ROOM_USER: {
    getKey: (roomId: string) => `ROOM_USER:${roomId}`,
    exprieTime: MAX_REDIS_CACHE_TIME,
  },

  ROOM_ANSWER: {
    getKey: (roomId: string) => `ROOM_ANSWER:${roomId}`,
    exprieTime: MAX_REDIS_CACHE_TIME,
  },
};

export * from './errorCodes';
export * from './securityOptions';

