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
export const WAIT_TIME_PER_QUESTION = 10; // seconds
export const CACHES = {
  SOCKET: {
    key: (userId: string) => `socket:${userId}`,
    // ? TODO
    // ttl:
  },
  CURRENT_QUESTION: {
    getKey: (roomId: string) => `ROOM_QUESTION:${roomId}`,
    exprieTime: (time: number) => time + WAIT_TIME_PER_QUESTION,
  },
};

export * from './errorCodes';
export * from './securityOptions';

