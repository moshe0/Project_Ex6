import {User} from "./Models/User";
import {Group} from "./Models/Group";

const basicUrl = 'http://localhost:4000';

export function GetSpecificUser(userName : string, userPassword : string):Promise<User> {
    const user = {
        userName : userName,
        userPassword : userPassword
    };

    return fetch(basicUrl + '/users/GetSpecificUser', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {'content-type': 'application/json'}
        }).then((res) => {
            return res.json();
        });
}

export function GetGroups():Promise<Group[]> {
    return fetch(basicUrl + '/groups/GetGroups', {
        headers: {'content-type': 'application/json'}
    }).then((res) => {
        return res.json();
    });
}

export function GetUsers():Promise<User[]> {
    return fetch(basicUrl + '/users/GetUsers', {
        headers: {'content-type': 'application/json'}
    }).then((res) => {
        return res.json();
    });
}


export function GetMessages(sender : any, receiver : any):Promise<any[]> {
    return fetch(basicUrl + '/messages/GetMessages', {
        method: 'POST',
        body: JSON.stringify({"sender" : {sender}, "receiver" : {receiver}}),
        headers: {'content-type': 'application/json'}
    }).then((res) => {
        if(res.status === 400)
            console.log(res.statusText);
        return res.json();
    });
}


export function AddMessage(message : any):Promise<void> {
    return fetch(basicUrl + '/messages/AddMessage', {
        method: 'POST',
        body: JSON.stringify(message),
        headers: {'content-type': 'application/json'}
    }).then((res) => {
        return res.json();
    });
}


export function AddUser(user : any):Promise<string> {
    return fetch(basicUrl + '/users/AddUser', {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {'content-type': 'application/json'}
    }).then((res) => {
        return res.json();
    });
}

export function AddGroup(group: any, newGroupName : string, parentId : number):Promise<string> {
    return fetch(basicUrl + '/groups/AddGroup', {
        method: 'POST',
        body: JSON.stringify({"group" : {group}, "newGroupName" : {newGroupName}, "parentId" : {parentId}}),
        headers: {'content-type': 'application/json'}
    }).then((res) => {
        return res.json();
    });
}


export function AddUserToExistingGroup(userName: string, parentId : number):Promise<string> {
    return fetch(basicUrl + '/groups/AddUserToExistingGroup', {
        method: 'POST',
        body: JSON.stringify({"userName" : {userName}, "parentId" : {parentId}}),
        headers: {'content-type': 'application/json'}
    }).then((res) => {
        return res.json();
    });
}

export function DeleteUserFromGroup(userId: number, parentId : number):Promise<string> {
    return fetch(basicUrl + '/groups/DeleteUserFromGroup', {
        method: 'DELETE',
        body: JSON.stringify({"userId" : {userId}, "parentId" : {parentId}}),
        headers: {'content-type': 'application/json'}
    }).then((res) => {
        return res.json();
    });
}

export function FlatteningGroup(id: number, parentId : number):Promise<string> {
    return fetch(basicUrl + '/groups/FlatteningGroup', {
        method: 'DELETE',
        body: JSON.stringify({"id" : {id}, "parentId" : {parentId}}),
        headers: {'content-type': 'application/json'}
    }).then((res) => {
        return res.json();
    });
}

export function DeleteGroup(id: number, parentId : number):Promise<string> {
    return fetch(basicUrl + '/groups/DeleteGroup', {
        method: 'DELETE',
        body: JSON.stringify({"id" : {id}, "parentId" : {parentId}}),
        headers: {'content-type': 'application/json'}
    }).then((res) => {
        return res.json();
    });
}



export function UpdateUser(user : any):Promise<string> {
    return fetch(basicUrl + '/users/UpdateUser', {
        method: 'PUT',
        body: JSON.stringify(user),
        headers: {'content-type': 'application/json'}
    }).then((res) => {
        return res.json();
    });
}



export function DeleteUser(userId : any):Promise<string> {
    return fetch(basicUrl + '/users/DeleteUser', {
        method: 'DELETE',
        body: JSON.stringify({"userId" : {userId}}),
        headers: {'content-type': 'application/json'}
    }).then((res) => {
        return res.json();
    });
}





