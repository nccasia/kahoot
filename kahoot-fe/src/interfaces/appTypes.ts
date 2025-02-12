/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AppActionType<T> {
  type: T;
  payload: any;
}

export interface IPaginationData {
  totalPage: number;
  total: number;
  pageSize: number;
  currentPage: number;
}
export interface IAppResponseBase<T> {
  statusCode: number;
  pagination: IPaginationData;
  data: T;
}
