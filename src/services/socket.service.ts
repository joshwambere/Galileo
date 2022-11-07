import MessageService from "@services/message.service";
import { createClient } from 'redis';
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import {SOCKET_PORT,REDIS_PORT,REDIS_HOST} from "@config";
import SocketUtil from "@utils/socket.util";
import {Message, MessageDto, MessageType, MessageTypes} from "@interfaces/message.interface";
import cors from "cors";
import {messageStatus} from "@/enums/message.status.enum";
import {chatRoom} from "@interfaces/socket.types";
import AuthService from "@services/auth.service";
import {User} from "@interfaces/users.interface";
import ChatRoomService from "@services/chatRoom.service";

class SocketService{
    private messageService = new MessageService();
    private userService = new AuthService()
    private chatRoomService = new ChatRoomService()
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
                const users =this.util.getRoomUsers(user.room)
                let usersInfo:any[]=[]
                for (const user of users) {
                    const userData = await this.userService.getUserInfo(user.user_id)
                    const iUser = {
                        user_id:{
                            _id:userData._id,
                            userName: userData.userName,
                            email: userData.email,
                            employeeId: userData.employeeId
                        }
                    }
                    usersInfo.push(iUser)
                }

                io.to(user.room).emit("users", {
                    room: user.room,
                    users: usersInfo,
                });
            });

            /*
            * send online users
            * */
            socket.on("users:online",async(data:chatRoom)=>{
                const users = this.util.getRoomUsers(data.id)
                let usersInfo:any[]=[]
                for (const user of users) {
                    const userData = await this.userService.getUserInfo(user.user_id)
                    const iUser = {
                        user_id:{
                            _id:userData._id,
                            userName: userData.userName,
                            email: userData.email,
                            employeeId: userData.employeeId,
                            online: true
                        }
                    }
                    usersInfo.push(iUser)
                }
                const dbUsers = await this.chatRoomService.getRoomMembers({chatRoomId: data.id})
                const allUsers = [...dbUsers,...usersInfo].filter((v,i,a)=>a.findIndex(t=>(t.user_id._id === v.user_id._id)))
                io.to(data.id).emit("online", allUsers);
            })

            /*
            * Runs when user sends message
            * */
            socket.on("message:create", async(msg:Message) => {
                const user = this.util.getCurrentUser(socket.id);
                if (!user) {
                    socket.emit('exception', {errorMessage:"You cant send message before joining room"})
                }else{
                    io.to(user.room).emit("message",  msg);
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
