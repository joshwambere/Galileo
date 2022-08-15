import App from '@/app';
import IndexRoute from '@routes/index.route';
import AuthRoute from "@routes/auth.route";

const app = new App([new IndexRoute(), new AuthRoute()]);

app.listen();
