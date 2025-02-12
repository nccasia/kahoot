import { SocketUser } from '@modules/user/dto/socket-user.dto';
import { Socket } from 'socket.io';

export enum RoomStatus {
  Created = 'created',
  Waiting = 'waiting',
  InProgress = 'in_progress',
  Finished = 'finished',
}

// ? TODO
export type UserSocket = Socket & { user: SocketUser };

export enum RoomClientEvent {
  ClientEmitJoinRoom = 'client_emit_join_room',
  OwnerStartGame = 'owner_start_game',
  ClientEmitSubmitQuestion = 'client_emit_submit_question',
}

export enum ClientConnectionEvent {
  UserConnected = 'user_connected',
  ClientError = 'client_error',
}
export enum RoomServerEvent {
  UserJoinedRoom = 'user_joined_room',
  ServerEmitUserJoinRoom = 'server_emit_user_join_room',
  ServerEmitLeaveRoom = 'server_emit_leave_room',
  ServerEmitGameStarted = 'server_game_started',
}

export enum StatusModifyCache {
  Add = 'add',
  Delete = 'delete',
}
