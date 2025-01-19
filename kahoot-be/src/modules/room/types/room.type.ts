import { Socket } from 'socket.io';

export enum RoomStatus {
  Waiting = 'waiting',
  InProgress = 'in_progress',
  Finished = 'finished',
}

// ? TODO
export type UserSocket = Socket & { user: { userId: string } };

export enum RoomClientEvent {
  ClientEmitJoinRoom = 'client_emit_join_room',
  ClientEmitSubmitQuestion = 'client_emit_submit_question',
}

export enum RoomServerEvent {
  ServerEmitUserJoinRoom = 'server_emit_user_join_room',
  ServerEmitLeaveRoom = 'server_emit_leave_room',
}

export enum StatusModifyCache {
  Add = 'add',
  Delete = 'delete',
}
