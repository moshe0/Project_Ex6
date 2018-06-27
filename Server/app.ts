import * as express from 'express';
import * as routes from './Routes';
import * as cors from 'cors';


const app = express();


app.use(cors());
app.use(express.json());


app.use('/users', routes.UsersRouter);
app.use('/groups', routes.GroupsRouter);
app.use('/messages', routes.MessagesRouter);

export default app;