import * as express from 'express';
import * as Controllers from '../Controllers';
import UserRouter from "./UsersRouter";

const GroupsRouter = express.Router();


GroupsRouter.get('/GetGroups', Controllers.GroupsController.GetGroups);

GroupsRouter.post('/AddGroup', Controllers.GroupsController.AddGroup);

GroupsRouter.delete('/DeleteGroup', Controllers.GroupsController.DeleteGroup);

GroupsRouter.delete('/FlatteningGroup', Controllers.GroupsController.FlatteningGroup);



GroupsRouter.post('/AddUserToExistingGroup', Controllers.GroupsController.AddUserToExistingGroup);

GroupsRouter.delete('/DeleteUserFromGroup', Controllers.GroupsController.DeleteUserFromGroup);


export default GroupsRouter;