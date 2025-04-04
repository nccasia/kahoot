const SocketEvents = {
  ON: {
    // on events
    ServerEmitWaitGameFinished: "server_emit_wait_game_finished",
    ServerEmitGameFinished: "server_emit_game_finished",
    ServerEmitWaitNextQuestion: "server_emit_wait_next_question",
    ServerEmitUserRanking: "server_emit_user_ranking",
    UserJoinedRoom: "user_joined_room",
    UserLeftRoom: "user_left_room",
    ServerEmitQuestion: "server_emit_question",
    ServerEmitCorrectAnswer: "server_emit_correct_answer",
    ServerEmitUserJoinRoom: "server_emit_user_join_room",
    ServerEmitLeaveRoom: "server_emit_leave_room",
    ServerEmitGameStarted: "server_game_started",
    ServerEmitUserSubmited: "server_emit_user_submited",
    ServerEmitNewUserSubmited: "server_emit_new_user_submited",
    ServerEmitQuestionFinished: "server_emit_question_finished",
    ServerEmitCurrentQuestion: "server_emit_current_question",
    UserReconnectedRoom: "user_reconnected_room",
    UserConnected: "user_connected",
    ClientError: "client_error",
  },
  EMIT: {
    // emit events
    ClientEmitJoinRoom: "client_emit_join_room",
    ClientEmitLeaveRoom: "client_emit_leave_room",
    ClientEmitGetCurrentQuestion: "client_emit_get_current_question",
    OwnerStartGame: "owner_start_game",
    OwnerFinishGame: "owner_finish_game",
    ClientEmitSubmitQuestion: "client_emit_submit_question",
  },
};
export default SocketEvents;
