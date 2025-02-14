export interface IGame {
  id: string;
  name: string;
  description: string;
  status: string;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ICreateGameDTO {
  name: string;
  description?: string;
  status: string;
}
