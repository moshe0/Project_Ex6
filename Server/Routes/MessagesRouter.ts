import * as express from 'express';
import * as Controllers from "../Controllers";

const MessagesRouter = express.Router();

MessagesRouter.post('/GetMessages', Controllers.MessagesController.GetMessages);

MessagesRouter.post('/AddMessage', Controllers.MessagesController.AddMessage);


export default MessagesRouter;