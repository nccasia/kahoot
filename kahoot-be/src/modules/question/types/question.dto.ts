import { MAX_QUESTION_OPTIONS } from '@constants';
import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  Min,
} from 'class-validator';

export class SingleChoiceAnswerOptionsDto {
  @ApiProperty({ isArray: true, type: String })
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(2, {
    message: 'Question should have at least 2 options',
  })
  @ArrayMaxSize(MAX_QUESTION_OPTIONS, {
    message: `Question options should be less than or equal to ${MAX_QUESTION_OPTIONS}`,
  })
  options: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  correctIndex: number;
}

export class SingleChoiceGameAnswerOptions {
  @ApiProperty({ isArray: true, type: String })
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  options: string[];
}
