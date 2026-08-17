const extendOrigin = process.env.EXTEND_CORS
  ? process.env.EXTEND_CORS.split(';')
  : [];
export const corsConfig = {
  origin: ['https://do-ban.nccsoft.vn', ...extendOrigin],
  credentials: true,
};
