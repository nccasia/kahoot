import { QueryOptionsHelper } from '@base/decorators/query-options.decorator';
import { QueryOptionsDto } from '@base/dtos/query-options.dto';
import { ERROR_CODES, MAX_QUESTION_OPTIONS } from '@constants';
import { AccessTokenPayload } from '@modules/auth/types';
import { Game } from '@modules/game/entities/game.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {}
  async createQuestionAsync(
    createQuestionDtoes: CreateQuestionDto[],
    gameId: string,
    payload: AccessTokenPayload,
  ) {
    const isQuestionInvalid = createQuestionDtoes.some((question) => {
      return (
        question.answerOptions.options.length < 2 ||
        question.answerOptions.options.length > MAX_QUESTION_OPTIONS
      );
    });

    if (isQuestionInvalid) {
      throw new BadRequestException({
        message: `Question options must be between 2 and ${MAX_QUESTION_OPTIONS}`,
        errorCode: ERROR_CODES.QUESTION.QUESTION_LIMIT_EXCEEDED,
      });
    }

    const game = await this.gameRepository.findOne({
      where: { id: gameId, ownerId: payload.userId },
    });
    if (!game) {
      throw new BadRequestException({
        message: `Game with id ${gameId} not found or you are not the owner`,
        errorCode: ERROR_CODES.GAME.GAME_NOT_FOUND,
      });
    }
    const questions = createQuestionDtoes.map((createQuestionDto) => {
      return this.questionRepository.create({
        ...createQuestionDto,
        gameId,
        ownerId: payload.userId,
      });
    });
    const createdQuestions = await this.questionRepository.save(questions);
    return createdQuestions;
  }

  async getGameQuestionsAsync(
    gameId: string,
    payload: AccessTokenPayload,
    queryOptionsDto: QueryOptionsDto,
  ) {
    const game = await this.gameRepository.findOne({
      where: { id: gameId, ownerId: payload.userId },
    });
    if (!game) {
      throw new BadRequestException({
        message: `Game with id ${gameId} not found or you are not the owner`,
        errorCode: ERROR_CODES.GAME.GAME_NOT_FOUND,
      });
    }
    const { getPagination, skip, take } = new QueryOptionsHelper(
      queryOptionsDto,
    );
    const [rawQuestions, count] = await this.questionRepository.findAndCount({
      where: { gameId: game.id },
      skip,
      take,
    });
    const resPagination = getPagination({
      count,
      total: rawQuestions.length,
    });
    return {
      data: rawQuestions,
      pagination: resPagination,
    };
  }

  async getQuestionAsync(questionId: string, payload: AccessTokenPayload) {
    const question = await this.questionRepository.findOne({
      where: { id: questionId, ownerId: payload.userId },
    });
    if (!question) {
      throw new BadRequestException({
        message: `Question with id ${questionId} not found or you are not the owner`,
        errorCode: ERROR_CODES.QUESTION.QUESTION_NOT_FOUND,
      });
    }
    return question;
  }

  async updateQuestionAsync(
    questionId: string,
    updateQuestionDto: UpdateQuestionDto,
    payload: AccessTokenPayload,
  ) {
    const question = await this.questionRepository.findOne({
      where: { id: questionId, ownerId: payload.userId },
    });
    if (!question) {
      throw new BadRequestException({
        message: `Question with id ${questionId} not found or you are not the owner`,
        errorCode: ERROR_CODES.QUESTION.QUESTION_NOT_FOUND,
      });
    }
    const updatedQuestion = await this.questionRepository.save({
      ...question,
      ...updateQuestionDto,
    });
    return updatedQuestion;
  }

  async removeQuestionAsync(questionId: string, payload: AccessTokenPayload) {
    const question = await this.questionRepository.findOne({
      where: { id: questionId, ownerId: payload.userId },
    });
    await this.questionRepository.softRemove(question);
    return { message: `Question with id ${questionId} he been removed` };
  }
}
