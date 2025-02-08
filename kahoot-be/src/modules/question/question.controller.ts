import { Auth } from '@base/decorators/auth.decorator';
import { QueryOptions } from '@base/decorators/query-options.decorator';
import { ApiResponseType } from '@base/decorators/response-swagger.decorator';
import { UserRequest } from '@base/decorators/user-request.decorator';
import { QueryOptionsDto } from '@base/dtos/query-options.dto';
import { AccessTokenPayload } from '@modules/auth/types';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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

  @ApiResponseType(ResponseCreateQuestion)
  @Post()
  createQuestion(
    @Body() createQuestionDto: CreateQuestionDto,
    @UserRequest() payload: AccessTokenPayload,
  ) {
    return this.questionService.createQuestionAsync(createQuestionDto, payload);
  }

  @ApiResponseType(ResponseGetQuestion, { isArray: true })
  @Get(':gameId')
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
    @UserRequest() payload: AccessTokenPayload,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.questionService.updateQuestionAsync(
      questionId,
      updateQuestionDto,
      payload,
    );
  }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.questionService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateQuestionDto: UpdateQuestionDto,
  // ) {
  //   return this.questionService.update(+id, updateQuestionDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.questionService.remove(+id);
  // }
}
