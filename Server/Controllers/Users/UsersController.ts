import * as services from './../../Services';



export async function AddUser(req, res){
    const result = await services.UsersService.AddUser(req.body);
    res.json(result);
}

export async function DeleteUser(req, res){
    const result = await services.UsersService.DeleteUser(parseInt(req.params['userId']));
    res.json(result);
}

export async function UpdateUser(req, res){
    let user = {"Id" : parseInt(req.params['id']), ...req.body};
    const result = await services.UsersService.UpdateUser(user);
    res.json(result);
}

export async function GetUsers(req, res){
    const result = await services.UsersService.GetUsers();
    res.json(result);
}

export async function GetSpecificUser(req, res){
    const result = await services.UsersService.GetSpecificUser(req.body);
    res.json(result);
}