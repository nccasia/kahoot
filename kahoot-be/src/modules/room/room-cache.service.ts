import { BaseCacheService } from '@base/modules/cache/redis.cache.service';
import { CACHES, RANKED_TOP } from '@constants';
import { RawGameQuestionDto } from '@modules/question/dto/raw-game-question.dto';
import { SocketUser } from '@modules/user/dto/socket-user.dto';
import { plainToInstance } from 'class-transformer';
import * as _ from 'lodash';
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

  async countRoomUsers(roomId: string) {
    const { getKey } = CACHES.ROOM_USER;
    const cacheKey = getKey(roomId);
    const numberOfUsers = await this.redis.scard(cacheKey);
    return numberOfUsers ?? 0;
  }

  async removeRoomUser(roomId: string, user: SocketUser) {
    const { getKey } = CACHES.ROOM_USER;
    const cacheKey = getKey(roomId);
    this.removeFromSet(cacheKey, JSON.stringify(user));
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

  async setFinishedQuestion(roomId: string, questionId: string) {
    const { getKey } = CACHES.ROOM_QUESTION;
    const cacheKey = getKey(roomId);
    await this.addToSet<string>(cacheKey, questionId);
  }

  async countFinishedQuestion(roomId: string) {
    const { getKey } = CACHES.ROOM_QUESTION;
    const cacheKey = getKey(roomId);
    const numberOfQuestions = await this.redis.scard(cacheKey);
    return numberOfQuestions ?? 0;
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

  async removeCurrentQuestion(roomId: string) {
    const { getKey } = CACHES.CURRENT_QUESTION;
    const cacheKey = getKey(roomId);
    await this.redis.del(cacheKey);
  }

  async setQuestionTimeout(
    roomId: string,
    questionId: string,
    time: number,
    timeoutId: NodeJS.Timeout,
  ) {
    const { getKey, exprieTime } = CACHES.ROOM_QUESTION_TIME;
    const cacheKey = getKey(roomId, questionId);
    await this.setCache(cacheKey, String(timeoutId), exprieTime(time));
  }

  async getQuestionTimeout(roomId: string, questionId: string) {
    const { getKey } = CACHES.ROOM_QUESTION_TIME;
    const cacheKey = getKey(roomId, questionId);
    const timeoutId = await this.getCache(cacheKey);
    return timeoutId;
  }
  async setUserAnswer(roomId: string, userAmswer: UserAnswerDto) {
    const { getKey } = CACHES.ROOM_ANSWER;
    const cacheKey = getKey(roomId);
    await this.addToSet<UserAnswerDto>(cacheKey, userAmswer);
  }

  async getQuestionUserAnswered(roomId: string, questionId: string) {
    const { getKey } = CACHES.ROOM_ANSWER;
    const cacheKey = getKey(roomId);
    const data = await this.getSetMembers(cacheKey);
    if (!data) {
      return [];
    }
    const userAnswers = data
      .filter((item) => item.questionId === questionId)
      .map((item) => plainToInstance(UserAnswerDto, item));
    return userAnswers;
  }

  async getUserSubmittedAnswer(
    roomId: string,
    questionId: string,
    userId: string,
  ) {
    const { getKey } = CACHES.ROOM_ANSWER;
    const cacheKey = getKey(roomId);
    const data = await this.getSetMembers(cacheKey);
    if (!data) {
      return null;
    }
    const userAnswer = _.first(
      data.filter(
        (item) => item.questionId === questionId && item.userId === userId,
      ),
    );
    return userAnswer ? plainToInstance(UserAnswerDto, userAnswer) : null;
  }

  async getUserPoint(roomId: string, questionId: string, userId: string) {
    const { getKey } = CACHES.ROOM_ANSWER;
    const cacheKey = getKey(roomId);
    const data = await this.getSetMembers(cacheKey);
    if (!data) {
      return 0;
    }
    const userAnswers = data.filter((item) =>
      item.userId === userId ? plainToInstance(UserAnswerDto, item) : null,
    );

    const currentQuestionAnswer = userAnswers.find(
      (item) => item.questionId === questionId,
    );
    const totalPoint = userAnswers.reduce((acc, item) => {
      return acc + item.point;
    }, 0);
    return {
      totalPoint: totalPoint,
      isCorrect: currentQuestionAnswer?.isCorrect ?? false,
      currentQuestionPoint: currentQuestionAnswer?.point ?? 0,
    };
  }

  async getUserTotalPoint(roomId: string, userId: string) {
    const { getKey } = CACHES.ROOM_ANSWER;
    const cacheKey = getKey(roomId);
    const data = await this.getSetMembers(cacheKey);
    if (!data) {
      return 0;
    }
    const userAnswers = data
      .filter((item) => item.userId === userId)
      .map((item) => plainToInstance(UserAnswerDto, item));
    const totalPoint = userAnswers.reduce((acc, item) => {
      return acc + item.point;
    }, 0);
    return totalPoint ?? 0;
  }

  async getRoomRanking(
    roomId: string,
    onlyTopOrder: boolean = true,
    topEntries?: number,
  ) {
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
        const userName = _.first(answers)?.userName;
        const avatar = _.first(answers)?.avatar;
        return {
          userId,
          userName,
          avatar,
          totalPoint,
          totalCorrect,
          totalWrong,
          correctRate,
        };
      },
    );
    return onlyTopOrder
      ? _.take(
          _.orderBy(userPoints, 'totalPoint', 'desc'),
          topEntries ?? RANKED_TOP,
        )
      : _.orderBy(userPoints, 'totalPoint', 'desc');
  }

  async getQuestionAnalysis(roomId: string, questionId: string) {
    const { getKey } = CACHES.ROOM_ANSWER;
    const cacheKey = getKey(roomId);
    const data = await this.getSetMembers(cacheKey);
    if (!data) {
      return [];
    }

    const allAnswersByQuestion = data
      .filter((item) => item.questionId === questionId)
      .map((item) => plainToInstance(UserAnswerDto, item));
    const groupByIndex = _.groupBy(
      allAnswersByQuestion,
      (item) => item.answerIndex,
    );

    const groupAswers = Object.entries(groupByIndex).map(([index, answers]) => {
      const totalSeleted = answers?.length ?? 0;
      return {
        answerIndex: index,
        totalSeleted: totalSeleted,
      };
    });
    return groupAswers;
  }

  async countSubmitedUser(roomId: string, questionId: string) {
    const { getKey } = CACHES.ROOM_ANSWER;
    const cacheKey = getKey(roomId);
    const data = await this.getSetMembers(cacheKey);
    if (!data) {
      return 0;
    }
    return data.filter((item) => item.questionId === questionId)?.length ?? 0;
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
    const countByUniqueQuestion =
      _.uniqBy(allAnswers, 'questionId')?.length ?? 0;
    return countByUniqueQuestion;
  }

  async clearRoomCache(roomId: string) {
    const { getKey: getKeyUser } = CACHES.ROOM_USER;
    const { getKey: getKeyQuestion } = CACHES.ROOM_QUESTION;
    const { getKey: getKeyAnswer } = CACHES.ROOM_ANSWER;
    const { getKey: getKeyGame } = CACHES.ROOM_GAME;
    const { getKey: getKeyCurrentQuestion } = CACHES.CURRENT_QUESTION;

    await this.redis.del(getKeyUser(roomId));
    await this.redis.del(getKeyQuestion(roomId));
    await this.redis.del(getKeyAnswer(roomId));
    await this.redis.del(getKeyGame(roomId));
    await this.redis.del(getKeyCurrentQuestion(roomId));
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

  async getSocketUser(userId: string) {
    const { key: mapKey } = CACHES.SOCKET;
    const key = mapKey(userId);
    const data = await this.getSetMembers(key);
    return data;
  }
}
