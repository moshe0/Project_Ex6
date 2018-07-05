import * as services from './../../Services';

export async function GetGroups(req, res){
    const result = await services.GroupsService.GetGroups();
    res.json(result);
}

export async function AddGroup(req, res){
    const result = await services.GroupsService.AddGroup(req.body['group'].group, req.body['newGroupName'].newGroupName, req.body['parentId'].parentId);
    res.json(result);
}

export async function DeleteGroup(req, res){
    const result = await services.GroupsService.DeleteGroup(req.params['id'], req.params['parentId']);
    res.json(result);
}

export async function FlatteningGroup(req, res){
    const result = await services.GroupsService.FlatteningGroup(req.params['id'], req.params['parentId']);
    res.json(result);
}



export async function AddUserToExistingGroup(req, res){
    const result = await services.GroupsService.AddUserToExistingGroup(req.body['userName'].userName, req.body['parentId'].parentId);
    res.json(result);
}

export async function DeleteUserFromGroup(req, res){
    const result = await services.GroupsService.DeleteUserFromGroup(req.params['userId'], req.params['parentId']);
    res.json(result);
}