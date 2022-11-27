import { DB_HOST, DB_PORT, DB_DATABASE,DB_PASSWORD,DB_USERNAME } from '@config';
import {ConnectionOptions} from "tls";


export const dbConnection = {
    url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        authSource: "admin",
        user: DB_USERNAME,
        pass: DB_PASSWORD,
    } as ConnectionOptions,
};
