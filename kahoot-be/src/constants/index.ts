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

export const CACHES = {
  SOCKET: {
    key: (userId: string) => `socket:${userId}`,
    // ? TODO
    // ttl:
  },
};
