import { BaseCacheService } from '@base/modules/cache/redis.cache.service';
import { CACHES } from '@constants';
import { RawGameQuestionDto } from '@modules/question/dto/raw-game-question.dto';
import { SocketUser } from '@modules/user/dto/socket-user.dto';
import { plainToInstance } from 'class-transformer';
import _ from 'lodash';
import { UserAnswerDto } from './dto/user-answer.dto';
import { UserRankDto } from './dto/user-rank.dto';
import { StatusModifyCache } from './types';

export class RoomCacheService extends BaseCacheService {
  async setRoomUser(roomId: string, user: SocketUser) {
    const { getKey } = CACHES.ROOM_USER;
    const cacheKey = getKey(roomId);
    await this.addToSet<SocketUser>(cacheKey, user);
  }

  async isJoinedRoom(roomId: string, userId: string) {
    const { getKey } = CACHES.ROOM_USER;
    const cacheKey = getKey(roomId);
    const data = await this.getSetMembers(cacheKey);
    return data ? data.some((item) => item.userId === userId) : false;
  }

  async getRoomUsers(roomId: string) {
    const { getKey } = CACHES.ROOM_USER;
    const cacheKey = getKey(roomId);
    const data = await this.getSetMembers(cacheKey);
    return data ? data.map((item) => plainToInstance(SocketUser, item)) : [];
  }

  async removeRoomUser(roomId: string, user: SocketUser) {
    const { getKey } = CACHES.ROOM_USER;
    const cacheKey = getKey(roomId);
    await this.removeFromSet(cacheKey, JSON.stringify(user));
  }

  async setTotalRoomQuestion(roomId: string, totalQuestion: number) {
    const { getKey, exprieTime } = CACHES.ROOM_GAME;
    const cacheKey = getKey(roomId);
    await this.setCache(cacheKey, totalQuestion, exprieTime);
  }

  async getTotalRoomQuestion(roomId: string) {
    const { getKey } = CACHES.ROOM_GAME;
    const cacheKey = getKey(roomId);
    const totalQuestion = await this.getCache(cacheKey);
    return totalQuestion ? Number(totalQuestion) : null;
  }

  async setCurrentQuestion(
    roomId: string,
    questionData: RawGameQuestionDto,
    questionTime?: number,
  ) {
    const { getKey, exprieTime } = CACHES.CURRENT_QUESTION;
    const cacheKey = getKey(roomId);
    await this.setCache(cacheKey, questionData, exprieTime(questionTime));
  }

  async setUserAnswer(roomId: string, userAmswer: UserAnswerDto) {
    const { getKey } = CACHES.ROOM_ANSWER;
    const cacheKey = getKey(roomId);
    await this.addToSet<UserAnswerDto>(cacheKey, userAmswer);
  }

  async getRoomRanking(roomId: string) {
    const { getKey } = CACHES.ROOM_ANSWER;
    const cacheKey = getKey(roomId);
    const data = await this.getSetMembers(cacheKey);
    if (!data) {
      return [];
    }
    const allUserAnswers = data.map((item) =>
      plainToInstance(UserAnswerDto, item),
    );
    const groupByUsers = _.groupBy(allUserAnswers, (item) => item.userId);
    const userPoints: Array<UserRankDto> = Object.entries(groupByUsers).map(
      ([userId, answers]): UserRankDto => {
        const totalPoint = answers.reduce((acc, item) => {
          return acc + item.point;
        }, 0);
        const totalCorrect = answers.filter((item) => item.isCorrect).length;
        const totalWrong = answers.length - totalCorrect;
        const correctRate = totalCorrect / answers.length;
        const userName = answers[0].userName;
        return {
          userId,
          userName,
          totalPoint,
          totalCorrect,
          totalWrong,
          correctRate,
        };
      },
    );
    return _.orderBy(userPoints, ['totalPoint'], ['desc']);
  }

  async countSubmitedUser(roomId: string, questionId: string) {
    const { getKey } = CACHES.ROOM_ANSWER;
    const cacheKey = getKey(roomId);
    const data = await this.getSetMembers(cacheKey);
    if (!data) {
      return 0;
    }
    return data.filter((item) => item.questionId === questionId);
  }

  async getCurrentQuestion(roomId: string) {
    const { getKey } = CACHES.CURRENT_QUESTION;
    const cacheKey = getKey(roomId);
    const data = await this.getCache(cacheKey);
    return data ? plainToInstance(RawGameQuestionDto, data) : null;
  }

  async getCountQuestionAnswered(roomId: string) {
    const { getKey } = CACHES.ROOM_ANSWER;
    const cacheKey = getKey(roomId);
    const data = await this.getSetMembers(cacheKey);
    const allAnswers = data.map((item) => plainToInstance(UserAnswerDto, item));
    const countByUniqueQuestion = _.uniqBy(allAnswers, 'questionId').length;
    return countByUniqueQuestion;
  }

  async modifyCacheSocketUser({
    socketId,
    userId,
    type = StatusModifyCache.Add,
  }: {
    socketId: string;
    userId: string;
    type?: StatusModifyCache;
  }) {
    const { key: mapKey } = CACHES.SOCKET;
    const key = mapKey(userId);

    if (type === StatusModifyCache.Add) {
      return this.addToSet(key, socketId);
    }
    return this.removeFromSet(key, socketId);
  }
}
