import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, DB_HOST, DB_PORT, DB_DATABASE, SECRET_KEY, ORIGIN,SENDGRID_API_KEY,SENDER_EMAIL,TOKEN_EXPIRES_IN } = process.env;
