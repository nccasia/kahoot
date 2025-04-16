/* eslint-disable @typescript-eslint/no-explicit-any */
export enum ChannelType {
  CHANNEL_TYPE_CHANNEL = 1,
  CHANNEL_TYPE_GROUP = 2,
  CHANNEL_TYPE_DM = 3,
  CHANNEL_TYPE_GMEET_VOICE = 4,
  CHANNEL_TYPE_FORUM = 5,
  CHANNEL_TYPE_STREAMING = 6,
  CHANNEL_TYPE_THREAD = 7,
  CHANNEL_TYPE_APP = 8,
  CHANNEL_TYPE_ANNOUNCEMENT = 9,
  CHANNEL_TYPE_MEZON_VOICE = 10,
}
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
  channelName?: string;
  type?: ChannelType;
  isPrivateChannel?: boolean;
}