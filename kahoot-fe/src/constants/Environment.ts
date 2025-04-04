const ENV = {
  // import env variables here
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL ?? "",
  APP_ID: import.meta.env.VITE_APP_ID ?? "",
  CLOUD_NAME: import.meta.env.VITE_CLOUD_NAME ?? "",
  CLOUD_BASE_URL: import.meta.env.VITE_CLOUD_BASE_URL ?? "",
  CLOUD_API_KEY: import.meta.env.VITE_CLOUD_API_KEY ?? "",
  CLOUD_API_SECRET: import.meta.env.VITE_CLOUD_API_SECRET ?? "",
  CLOUDINARY_URL: import.meta.env.VITE_CLOUDINARY_URL ?? "",
};
export default ENV;
