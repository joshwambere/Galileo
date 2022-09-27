import MessageService from "@services/message.service";
import { createClient } from 'redis';
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import {SOCKET_PORT,REDIS_PORT,REDIS_HOST} from "@config";
import SocketUtil from "@utils/socket.util";

class SocketService{
    private messageService = new MessageService();
    private util = new SocketUtil();
    private pubClient;
    private subClient;

    public initializeSocketRedis = (io:Server) => {
        this.pubClient = createClient({ url: `redis://${REDIS_HOST}` });

        this.subClient = this.pubClient.duplicate();
        (async () => {
            await this.pubClient.connect();
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
        io.on('connection', (socket) => {
            console.info(`===== 🚀 Socket connected =====`)
            socket.on('disconnect', () => {
                console.info(`===== ❌ Socket disconnected =====`)
            });

            /*
           * Runs when user sends message
           * */
            socket.on("joinRoom", async({ data }) => {
                const user = this.util.userJoin(socket.id, data.sender, data.chatRoom);
                socket.join(user.room);
                const msg = await this.messageService.get(user.room)
                io.to(user.room).emit("message:prev",  msg);


                io.to(user.room).emit("users", {
                    room: user.room,
                    users: this.util.getRoomUsers(user.room),
                });
                console.log(this.util.getRoomUsers(user.room),)
            });

            /*
            * Runs when user sends message
            * */
            socket.on("message:create", async(msg) => {
                const user = this.util.getCurrentUser(socket.id);
                if (!user) {
                    socket.emit('exception', {errorMessage:"You cant send message before joining room"})
                }else{
                    io.to(user.room).emit("message",  msg);
                    await this.messageService.create(msg);
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
