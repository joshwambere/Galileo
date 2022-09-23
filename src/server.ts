import App from '@/app';
import IndexRoute from '@routes/index.route';
import AuthRoute from "@routes/auth.route";
import ProjectRoute from "@routes/project.route";

const app = new App([new IndexRoute(), new AuthRoute(), new ProjectRoute()]);

app.listen();
