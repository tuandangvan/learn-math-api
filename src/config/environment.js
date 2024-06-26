import "dotenv/config";

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,

  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,
  HOSTING: process.env.HOSTING,

  BUILD_MODE: process.env.BUILD_MODE,

  AUTHOR: process.env.AUTHOR,
  JWT_SECRET: process.env.JWT_SECRET,

  CLOUD_NAME: process.env.CLOUD_NAME,
  API_KEY: process.env.API_KEY,
  API_SECRET: process.env.API_SECRET,
  HOSTING: process.env.HOSTING,

  AUTHOR_EMAIL_PASSWORD: process.env.AUTHOR_EMAIL_PASSWORD,
  AUTHOR_EMAIL: process.env.AUTHOR_EMAIL,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};
