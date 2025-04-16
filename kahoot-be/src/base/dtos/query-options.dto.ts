import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsObject, IsOptional } from 'class-validator';
import { IsSortQuery } from '../pipes/is-sort-query';

type OperatorQuery = 'eq' | 'neq' | 'gte' | 'gt' | 'lte' | 'lte';
export type Filter = Record<OperatorQuery, any>;

export class QueryOptionsDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  page: number;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return JSON.parse(value);
    }
    return value;
  })
  @IsSortQuery()
  sort: Record<string, 'desc' | 'asc'>;

  @ApiPropertyOptional()
  @IsOptional()
  search: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  filters: Record<string, Filter> = {};
}
