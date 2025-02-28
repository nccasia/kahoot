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
  hashKey: string;
}

export interface IGetTokenResponse {
  accessToken: string;
  userId: string;
  email: string;
  userName: string;
}

export interface ICurrentUser {
  userId: string;
  mezonUserId: string;
  email: string;
  userName: string;
  avatar: string;
  accessToken: string;
}

export interface IUser {
  id: string;
  mezonUserId: string;
  email: string;
  userName: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface IMezonUser {
  email: string;
  mezon_id: string;
  user: {
    avatar_url: string;
    display_name: string;
    id: string;
    username: string;
  };
  wallet: string;
}

export interface IUserHashInfo {
  user_id: string;
  hash: string;
}
