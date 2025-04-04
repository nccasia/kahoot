import { ApiQueryOptions } from '@base/decorators/api-query-options.decorator';
import { Auth } from '@base/decorators/auth.decorator';
import { QueryOptions } from '@base/decorators/query-options.decorator';
import { ApiResponseType } from '@base/decorators/response-swagger.decorator';
import { UserRequest } from '@base/decorators/user-request.decorator';
import { QueryOptionsDto } from '@base/dtos/query-options.dto';
import { AccessTokenPayload } from '@modules/auth/types';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionService } from './question.service';
import {
  ResponseCreateQuestion,
  ResponseGetQuestion,
} from './types/question.response';

@ApiTags('Questions')
@Auth()
@Controller('questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiResponseType(ResponseCreateQuestion, { isArray: true })
  @ApiBody({ type: [CreateQuestionDto] })
  @Post('add-questions/:gameId')
  createQuestion(
    @Param('gameId') gameId: string,
    @Body() createQuestionDtoes: Array<CreateQuestionDto>,
    @UserRequest() payload: AccessTokenPayload,
  ) {
    return this.questionService.createQuestionAsync(
      createQuestionDtoes,
      gameId,
      payload,
    );
  }

  @ApiQueryOptions()
  @ApiResponseType(ResponseGetQuestion, { isArray: true })
  @Get('game-questions/:gameId')
  getGameQuestions(
    @Param('gameId') gameId: string,
    @UserRequest()
    payload: AccessTokenPayload,
    @QueryOptions() queryOptionsDto: QueryOptionsDto,
  ) {
    return this.questionService.getGameQuestionsAsync(
      gameId,
      payload,
      queryOptionsDto,
    );
  }

  @ApiResponseType(ResponseGetQuestion)
  @Get(':questionId')
  getQuestion(
    @Param('questionId') questionId: string,
    @UserRequest() payload: AccessTokenPayload,
  ) {
    return this.questionService.getQuestionAsync(questionId, payload);
  }

  @ApiResponseType(ResponseGetQuestion)
  @Put(':questionId')
  updateQuestion(
    @Param('questionId') questionId: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @UserRequest() payload: AccessTokenPayload,
  ) {
    return this.questionService.updateQuestionAsync(
      questionId,
      updateQuestionDto,
      payload,
    );
  }

  @Delete(':questionId')
  removeQuestion(
    @Param('questionId') questionId: string,
    @UserRequest() payload: AccessTokenPayload,
  ) {
    return this.questionService.removeQuestionAsync(questionId, payload);
  }
}
