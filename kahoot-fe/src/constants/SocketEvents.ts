const SocketEvents = {
  ON: {
    // on events
    ServerEmitWaitGameFinishedd: "server_emit_wait_game_finished",
    ServerEmitGameFinishedd: "server_emit_game_finished",
    ServerEmitWaitNextQuestiond: "server_emit_wait_next_question",
    ServerEmitUserRankingd: "server_emit_user_ranking",
    UserJoinedRoomd: "user_joined_room",
    ServerEmitQuestiond: "server_emit_question",
    ServerEmitCorrectAnswerd: "server_emit_correct_answer",
    ServerEmitUserJoinRoomd: "server_emit_user_join_room",
    ServerEmitLeaveRoomd: "server_emit_leave_room",
    ServerEmitGameStartedd: "server_game_started",

    UserConnected: "user_connected",
    ClientError: "client_error",
  },
  EMIT: {
    // emit events
    ClientEmitJoinRoom: "client_emit_join_room",
    ClientEmitGetCurrentQuestion: "client_emit_get_current_question",
    OwnerStartGame: "owner_start_game",
    ClientEmitSubmitQuestion: "client_emit_submit_question",
  },
};
export default SocketEvents;
