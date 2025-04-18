import { SocketUser } from '@modules/user/dto/socket-user.dto';
import { Socket } from 'socket.io';

export enum RoomStatus {
  Scheduled = 'scheduled',
  Waiting = 'waiting',
  InProgress = 'in_progress',
  Paused = 'paused',
  Finished = 'finished',
  Cancelled = 'cancelled',
}

// ? TODO
export type UserSocket = Socket & { user: SocketUser };

export enum RoomClientEvent {
  ClientEmitJoinRoom = 'client_emit_join_room',
  ClientEmitLeaveRoom = 'client_emit_leave_room',
  ClientEmitGetCurrentQuestion = 'client_emit_get_current_question',
  OwnerStartGame = 'owner_start_game',
  OwnerFinishGame = 'owner_finish_game',
  OwnerPauseGame = 'owner_pause_game',
  OwnerResumeGame = 'owner_resume_game',
  ClientEmitSubmitQuestion = 'client_emit_submit_question',
}
export enum ClientConnectionEvent {
  UserConnected = 'user_connected',
  ClientError = 'client_error',
}
export enum RoomServerEvent {
  ServerEmitWaitGameFinished = 'server_emit_wait_game_finished',
  ServerEmitGamePaused = 'server_emit_game_paused',
  ServerEmitGameResumed = 'server_emit_game_resumed',
  ServerEmitGameFinished = 'server_emit_game_finished',
  ServerEmitQuestionFinished = 'server_emit_question_finished',
  ServerEmitWaitNextQuestion = 'server_emit_wait_next_question',
  ServerEmitUserRanking = 'server_emit_user_ranking',
  UserJoinedRoom = 'user_joined_room',
  UserLeftRoom = 'user_left_room',
  UserReconnectedRoom = 'user_reconnected_room',
  ServerEmitCurrentQuestion = 'server_emit_current_question',
  ServerEmitQuestion = 'server_emit_question',
  ServerEmitUserSubmited = 'server_emit_user_submited',
  ServerEmitNewUserSubmited = 'server_emit_new_user_submited',
  ServerEmitCorrectAnswer = 'server_emit_correct_answer',
  ServerEmitUserJoinRoom = 'server_emit_user_join_room',
  ServerEmitLeaveRoom = 'server_emit_leave_room',
  ServerEmitGameStarted = 'server_game_started',
}

export enum StatusModifyCache {
  Add = 'add',
  Delete = 'delete',
}
