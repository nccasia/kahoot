export const generateRoomCode = () => {
  return ((Date.now() % 1000000) + Math.floor(Math.random() * 1000))
    .toString()
    .padStart(6, '0');
};
