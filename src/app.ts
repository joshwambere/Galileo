import express from 'express';
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
import { NODE_ENV, PORT,SOCKET_PORT } from '@config';
import {Routes} from '@interfaces/routes.interface';
import { connect, set } from 'mongoose';
import { dbConnection } from '@databases';
import cors from 'cors';
import cookieParser from "cookie-parser";
import errorMiddleware from "@middlewares/error.middleware";
import {seeds} from "@/databases/index.seed";
import { Server } from "socket.io";
import MessageController from "@controllers/message.controller";
import {messageTypeGuard} from "@/guards/message.type.guard";
import {MessageDto, MessageTypes, RoomDto} from "@interfaces/message.interface";
import MessageService from "@services/message.service";
import SocketService from "@services/socket.service";


class App{
    public app: express.Application;
    public port: string | number;
    public env: string;
    private socketIoOptions ={
        pingTimeout: 10000,
        cors: {
            origin: ["http://localhost:3000", "http://localhost:4000"],
            credentials: true
        },

    }
    private socketPort:string |number;

    constructor(routes: Routes[] ){
        this.app = express();
        this.env = NODE_ENV || 'development';
        this.port = PORT || 7000;
        this.socketPort = SOCKET_PORT || 7001;

        this.connectToDatabase();
        this.seedDatabase();
        this.initializeMiddlewares()
        this.initializeRoutes(routes);
        this.initializeSocket();
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

    private async  seedDatabase(){
        if (this.env === 'development') {
            await seeds();
        }
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
    private async initializeSocket(){
        const socketService = new SocketService();
        const io = new Server();
        await socketService.initializeSocketRedis(io);
        await socketService.connect(io);
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
