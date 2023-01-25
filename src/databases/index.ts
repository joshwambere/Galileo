import { DB_HOST, DB_PORT, DB_DATABASE,DB_PASSWORD,DB_USERNAME } from '@config';
import {ConnectionOptions} from "tls";


export const dbConnection = {
    url: `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}?authSource=admin&directConnection=true`,
    options: {
        useNewUrlParser: true,
    } as ConnectionOptions,

};
