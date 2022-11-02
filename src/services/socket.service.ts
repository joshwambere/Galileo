import MessageService from "@services/message.service";
import { createClient } from 'redis';
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import {SOCKET_PORT,REDIS_PORT,REDIS_HOST} from "@config";
import SocketUtil from "@utils/socket.util";
import {Message, MessageDto, MessageType, MessageTypes} from "@interfaces/message.interface";
import cors from "cors";
import {messageStatus} from "@/enums/message.status.enum";

class SocketService{
    private messageService = new MessageService();
    private util = new SocketUtil();
    private pubClient;
    private subClient;

    public initializeSocketRedis = (io:Server) => {
        this.pubClient = createClient({ url: `redis://${REDIS_HOST}` });

        this.subClient = this.pubClient.duplicate();
        (async () => {
            const whiteList = ['http://localhost:3005', 'http://localhost:4000'];
            await this.pubClient.connect(cors({ origin: (origin, callback) => {
                    if (whiteList.indexOf(origin) !== -1) {
                        callback(null, true);
                    } else {
                        callback(new Error('Not allowed by CORS'));
                    }
                },
                credentials: true,
            }));
        })();
        this.pubClient.on("error", (err) => {
            console.error(err);
        })
        io.adapter(createAdapter(this.pubClient, this.subClient))
        io.listen(parseInt(SOCKET_PORT));

        console.info("================================================")
        console.info(`===== 🚀 Socket listening on the port ${REDIS_PORT} =====`)
        console.info("================================================")
    }

    public connect = async (io:Server) => {
        /*
        * on connects
        * */
        io.on('connection', (socket) => {
            console.info(`===== 🚀 Socket with id ${socket.id} connected =====`);
            socket.on('disconnect', () => {
                console.info(`===== ❌ Socket disconnected =====`)
            });

            /*
           * Runs when user sends message
           *
           * */
            socket.on("join:room", async( data ) => {
                const user = this.util.userJoin(socket.id, data.sender, data.chatRoom, data.user_id);
                socket.join(user.room);

                const messages = await this.messageService.get(user.room)
                io.to(user.room).emit("message:prev",  messages);


                io.to(user.room).emit("users", {
                    room: user.room,
                    users: this.util.getRoomUsers(user.room),
                });
            });

            /*
            * Runs when user sends message
            * */
            socket.on("message:create", async(msg:Message) => {
                const user = this.util.getCurrentUser(socket.id);
                if (!user) {
                    socket.emit('exception', {errorMessage:"You cant send message before joining room"})
                }else{
                    io.to(user.room).emit("message",  msg);
                    console.log(msg);
                    console.log("**************")
                    console.log(user);
                    const newMessage:MessageDto = {
                        chatRoom: user.room,
                        message: msg.message,
                        messageType: Object.values(MessageType).some((v) => v === msg.messageType)? msg.messageType: MessageType.TEXT,
                        sender: user.user_id,
                        status: messageStatus.PENDING,
                        createdAt: msg.createdAt

                    }
                    const persistMessage = {
                        type: 'create',
                        data: newMessage
                    }

                    const sent = await this.messageService.create(persistMessage);

                    sent.code === 201 ? io.to(user.room).emit("message:sent",  true) : socket.emit('exception', {errorMessage:sent.message})
                }
            });

            /*
            * Runs when user leave channel
            * */
            socket.on("disconnect", () => {
                const user = this.util.userLeave(socket.id);

                if (user) {
                    io.to(user.room).emit("users", {
                        room: user.room,
                        users: this.util.getRoomUsers(user.room),
                    });
                }
            });
        })
    }


}

export default SocketService;
