export const SecurityOptions = {
  JWT_EXPIRATION_TIME: '7d',
  PASSWORD_SALT_ROUNDS: 10,
};

export const corsConfig = {
  origin: [
    'http://localhost:5173',
    'http://10.10.21.37:5173',
    'https://doban.nccsoft.vn',
    'https://doban.vncsoft.com',
    'https://kahoot.nccsoft.vn',
  ],
  credentials: true,
};
