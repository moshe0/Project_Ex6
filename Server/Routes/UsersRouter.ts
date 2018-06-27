import * as express from 'express';
import * as Controllers from '../Controllers';

const UserRouter = express.Router();

// UserRouter.post('/', (req, res) => res.send(console.log('Hello World!')));

UserRouter.post('/AddUser', Controllers.UsersController.AddUser);

UserRouter.delete('/DeleteUser', Controllers.UsersController.DeleteUser);

UserRouter.put('/UpdateUser', Controllers.UsersController.UpdateUser);

UserRouter.get('/GetUsers', Controllers.UsersController.GetUsers);

UserRouter.post('/GetSpecificUser', Controllers.UsersController.GetSpecificUser);


// UserRouter.get('/:parmeter1/:parmeter2', Controller.ff);


export default UserRouter;