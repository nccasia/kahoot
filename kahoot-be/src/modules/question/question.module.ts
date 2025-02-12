import { Game } from '@modules/game/entities/game.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './entities/question.entity';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Question])],
  controllers: [QuestionController],
  providers: [QuestionService],
})
export class QuestionModule {}
