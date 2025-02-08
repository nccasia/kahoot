import { QueryOptionsHelper } from '@base/decorators/query-options.decorator';
import { QueryOptionsDto } from '@base/dtos/query-options.dto';
import { ERROR_CODES } from '@constants';
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
    createQuestionDto: CreateQuestionDto,
    payload: AccessTokenPayload,
  ) {
    const game = await this.gameRepository.findOne({
      where: { id: createQuestionDto.gameId, ownerId: payload.userId },
    });
    if (!game) {
      throw new BadRequestException({
        message: `Game with id ${createQuestionDto.gameId} not found or you are not the owner`,
        errorCode: ERROR_CODES.GAME.GAME_NOT_FOUND,
      });
    }
    const question = this.questionRepository.create({
      ...createQuestionDto,
      ownerId: payload.userId,
    });
    await this.questionRepository.save(question);
    return question;
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

  // remove(id: number) {
  //   return `This action removes a #${id} question`;
  // }
}
