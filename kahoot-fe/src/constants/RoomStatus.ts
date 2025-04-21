export enum ERoomStatus {
  Scheduled = "scheduled",
  Waiting = "waiting",
  InProgress = "in_progress",
  Paused = "paused",
  Finished = "finished",
  Cancelled = "cancelled",
}

export const RoomStatus = {
  [ERoomStatus.Scheduled]: "Đã lên lịch",
  [ERoomStatus.Waiting]: "Đang chờ",
  [ERoomStatus.InProgress]: "Đang diễn ra",
  [ERoomStatus.Paused]: "Tạm dừng",
  [ERoomStatus.Finished]: "Đã kết thúc",
  [ERoomStatus.Cancelled]: "Đã hủy",
};
export const RoomStatusColor = {
  [ERoomStatus.Scheduled]: "text-[#FFB800]",
  [ERoomStatus.Waiting]: "text-[#FFB800]",
  [ERoomStatus.InProgress]: "text-[#00C9A7]",
  [ERoomStatus.Paused]: "text-[#FFB800]",
  [ERoomStatus.Finished]: "text-[#00C9A7]",
  [ERoomStatus.Cancelled]: "text-[#FFB800]",
};
