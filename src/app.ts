import express from 'express';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT } from '@config';
import {Routes} from '@interfaces/routes.interface';
import { connect, set } from 'mongoose';
import { dbConnection } from '@databases';
import cors from 'cors';
import cookieParser from "cookie-parser";
import errorMiddleware from "@middlewares/error.middleware";


class App{
    public app: express.Application;
    public port: string | number;
    public env: string;

    constructor(routes: Routes[] ){
        this.app = express();
        this.env = NODE_ENV || 'development';
        this.port = PORT || 7000;

        this.connectToDatabase();
        this.initializeMiddlewares()
        this.initializeRoutes(routes);
        this.initializeSwagger();
        this.initializeErrorHandling()
    }
    public listen() {
        this.app.listen(this.port, () => {
            console.info(`=================================`);
            console.info(`======= ENV: ${this.env} =======`);
            console.info(`🚀 App listening on the port ${this.port}`);
            console.info(`=================================`);
        });
    }

    private connectToDatabase() {
        if (this.env !== 'production') {
            set('debug', true);
        }

        connect(dbConnection.url, dbConnection.options)
            .then(()=>{
                console.info(`===== 🚀 Connected to database =====`);
            }).catch(err=>{
                console.error(`===== ❌ Error connecting to database=====`);
                console.error(err);
            });
    }
    private initializeRoutes(routes: Routes[]) {
        routes.forEach(route => {
            this.app.use('/', route.router);
        });
    }
    private initializeMiddlewares() {
        this.app.use(cors({ origin: '*' }));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());
    }
    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
    private initializeSwagger() {
        const options = {
            swaggerDefinition: {
                info: {
                    title: 'REST API',
                    version: '1.0.0',
                    description: 'Galileo docs',
                },
            },
            apis: ['swagger.yaml'],
        };

        const specs = swaggerJSDoc(options);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
    }
}

export default App;
