import { DB_HOST, DB_PORT, DB_DATABASE } from '@config';
import {ConnectionOptions} from "tls";

export const dbConnection = {
    url: `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    } as ConnectionOptions,
};
