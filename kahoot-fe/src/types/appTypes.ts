/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AppActionType<T> {
  type: T;
  payload: any;
}

export interface IAppResponseBase<T> {
  statusCode: number;
  message: string;
  data?: T;
}
