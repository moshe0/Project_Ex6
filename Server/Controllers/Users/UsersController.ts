import * as services from './../../Services';



export async function AddUser(req, res){
    const result = await services.UsersService.AddUser(req.body);
    res.json(result);
}

export async function DeleteUser(req, res){
    const result = await services.UsersService.DeleteUser(req.body['userId'].userId);
    res.json(result);
}

export async function UpdateUser(req, res){
    const result = await services.UsersService.UpdateUser(req.body);
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