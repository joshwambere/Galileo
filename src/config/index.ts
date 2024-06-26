import { config } from 'dotenv';
config({ path: `.env` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';

export const { NODE_ENV, PORT, DB_HOST, DB_PORT, DB_DATABASE, SECRET_KEY,REDIS_HOST,SENDGRID_API_KEY,SENDER_EMAIL,TOKEN_EXPIRES_IN, SOCKET_PORT, REDIS_PORT,REDIS_URL,API_VERSION } = process.env;
