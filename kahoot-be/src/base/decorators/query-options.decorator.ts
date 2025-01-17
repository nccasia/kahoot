import {
  BadRequestException,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { Request } from 'express';
import { QueryOptionsDto } from '../dtos/query-options.dto';
import { validate } from 'class-validator';

interface Options {
  acceptFilterFields: string[];
}
export class QueryOptionsHelper {
  sort: Record<string, 'desc' | 'asc'>;
  search: string;
  take: number;
  skip: number;
  filters: Record<string, string>;
  limit: number = 10;
  page: number = 1;

  constructor(partial: Partial<QueryOptionsDto>, options: Options) {
    console.log('partial', partial);
    this.sort = partial.sort || {};
    this.take = partial.limit || 10;
    this.skip = partial.page > 0 ? (partial.page - 1) * this.take : 0;
    this.search = partial.search || '';
    this.filters = this.mapFindOptions(
      partial.filters,
      options.acceptFilterFields,
    );
    if (partial.page) this.page = partial.page;
    if (this.limit) this.limit = partial.limit;
  }

  getPagination = ({ count, total }: { count: number; total: number }) => {
    // total mean length page
    // count mean length all record
    const totalPage = Math.ceil(count / this.take);
    const pageSize = this.limit;
    const currentPage = this.page;
    return { totalPage, total, pageSize, currentPage };
  };

  private mapFindOptions = (
    filters: QueryOptionsDto['filters'],
    acceptFields: string[] = [],
  ): Record<string, string> => {
    let filterObject = {};
    for (let field in filters) {
      const filter = filters[field];
      const key = Object.keys(filter)?.[0] as keyof typeof filter;

      if (!acceptFields.includes(field)) continue;

      switch (key) {
        case 'eq':
          filterObject[field] = filter[key];
          break;
        default:
      }
    }
    return filterObject;
  };
}

export const QueryOptions = createParamDecorator(
  async (
    options: Options = { acceptFilterFields: [] },
    ctx: ExecutionContext,
  ) => {
    const req: Request = ctx.switchToHttp().getRequest();

    const query = (req as any).query as unknown as QueryOptionsDto;
    const { search, sort, page = 1, limit = 20, filters } = query;
    return { search, sort, page, limit, filters };
    // const ValidateQuery = new QueryOptionsDto();
    // for (let key in query) {
    //   ValidateQuery[key] = query[key];
    // }

    // await validate(ValidateQuery).then((errors) => {
    //   if (errors.length) {
    //     const message = errors.map(
    //       (error) => error.constraints[Object.keys(error.constraints)[0]],
    //     );
    //     throw new BadRequestException({ message });
    //   }
    // });

    // const helper = new QueryOptionsHelper(
    //   { search, sort, page, limit, filters },
    //   options,
    // );
    // return helper;
  },
);
