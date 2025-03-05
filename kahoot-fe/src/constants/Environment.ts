const ENV = {
  // import env variables here
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL ?? "",
  APP_ID: import.meta.env.VITE_APP_ID ?? "",
};
export default ENV;
