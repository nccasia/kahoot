export interface ILoginData {
  email: string;
  password: string;
}
export interface IRegisterData {
  email: string;
  password: string;
  fullName: string;
}
export interface IGetTokenDTO {
  mezonUserId: string;
  email: string;
  userName: string;
  avatar: string;
}

export interface IGetTokenResponse {
  accessToken: string;
  userId: string;
  email: string;
  userName: string;
}

export interface ICurrentUser {
  userId: string;
  email: string;
  userName: string;
  avatar: string;
}
