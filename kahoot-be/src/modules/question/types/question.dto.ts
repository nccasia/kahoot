import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  Min,
} from 'class-validator';

export class SingleChoiceAnswerOptionsDto {
  @ApiProperty({ isArray: true, type: String })
  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  options: string[];

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  correctIndex: number;
}
