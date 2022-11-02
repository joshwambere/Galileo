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
import path from "path";
import SocketService from "@services/socket.service";
import {compare} from "bcrypt";


class App{
    public app: express.Application;
    public port: string | number;
    public env: string;
    public staticPath = path
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
        this.initializeSocketDocs();
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
        if (this.env === 'development' || this.env === 'production') {
            await seeds();
        }
    }
    private initializeRoutes(routes: Routes[]) {
        routes.forEach(route => {
            this.app.use('/', route.router);
        });
    }
    private initializeMiddlewares() {
        this.app.use(cors({
                credentials:true,
                origin: (origin, callback) => {
                    const whiteList = ["http://localhost:3005","http://localhost:3000", "http://localhost:4000","https://galileo-ui.vercel.app/"];
                    if (whiteList.indexOf(origin) !== -1) {
                        callback(null, true);
                    } else {
                        if (!origin && this.env === 'development') {
                            callback(null, true);
                        }else{
                            callback(new Error('Not allowed by CORS'));
                        }

                    }
                },
            }
        ));
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
                }
            },
            apis: ['swagger.yaml'],
        };

        const specs = swaggerJSDoc(options);
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { enableCors: false }));
    }
    private initializeSocketDocs(){
        if(this.env === 'development'){
            this.app.use('/socket-docs', express.static(this.staticPath.join(__dirname, '../docs/html')))
        }
    }

}

export default App;
