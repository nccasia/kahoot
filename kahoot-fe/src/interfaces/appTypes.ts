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
  pagination?: IPaginationData;
  errorCode: number | null;
  message: string | null;
  data: T;
}

export interface IUploadImageResponse {
  public_id: string;
  url: string;
  secure_url: string;
  display_name: string;
  format: string;
}

export interface IChannelInfo {
  clanId: string;
  channelId: string;
}