import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';

export const { NODE_ENV, PORT, DB_HOST, DB_PORT, DB_DATABASE, SECRET_KEY,REDIS_HOST,SENDGRID_API_KEY,SENDER_EMAIL,TOKEN_EXPIRES_IN, SOCKET_PORT, REDIS_PORT,REDIS_URL,HOST, DB_USERNAME, DB_PASSWORD } = process.env;
