import App from '@/app';
import IndexRoute from '@routes/index.route';
import AuthRoute from "@routes/auth.route";
import ProjectRoute from "@routes/project.route";
import chatRoomRoute from "@routes/chatRoom.route";

const app = new App([new IndexRoute(), new AuthRoute(), new ProjectRoute(), new chatRoomRoute()]);

app.listen();

