import {DB} from "../../DB/DB";
import {GetNextId} from "../../Helpers/MainHelpers";



export function AddUser(user: any){
    return new Promise((resolve) => {
        const result = _AddUser(user);
        resolve(result);
    });
}
function _AddUser(user: any){
    if(_UserIndexOf(DB.Users, user.Name) === -1) {
        user.Id = GetNextId(DB.Users);
        DB.Users.push(Object.assign({}, user));
        DB.writeFile('Users');
        return 'succeeded! user \'' + user.Name + '\' added';
    }
    else
        return 'failed! The user is already exists';
}


export function DeleteUser(userId: number){
    return new Promise((resolve) => {
        const result = _DeleteUser(userId);
        resolve(result);
    });
}
function _DeleteUser(userId: number){
    let index = DB.Users.findIndex(item => item.Id === userId);
    if(index === -1)
        return 'failed';
    let userName = DB.Users[index].Name;
    DB.Users.splice(index, 1);
    let result = DB.writeFile('Users');
    if(result === 'succeeded') {
        result = DB.writeFile('Groups');
        if (result === 'succeeded')
            return 'succeeded! user \'' + userName + '\' deleted';
        return 'failed';
    }
    return 'failed';
}


export function UpdateUser(user: any){
    return new Promise((resolve) => {
        const result = _UpdateUser(user);
        resolve(result);
    });
}
function _UpdateUser(user: any){
    let index = DB.Users.findIndex(item => item.Id === user.Id);
    DB.Users[index].Password = user.Password;
    DB.Users[index].Age = user.Age;
    let result = DB.writeFile('Users');
    if(result === 'succeeded')
        return 'succeeded! user \'' + user.Name + '\' updated';
    return 'failed';
}


export function GetUsers(){
    return new Promise((resolve) => {
        const result = _GetUsers();
        resolve(result);
    });
}
function _GetUsers(){
    return DB.Users;
}


export function GetSpecificUser(user){
    return new Promise((resolve) => {
        const result = _GetSpecificUser(user);
        resolve(result);
    });
}
function _GetSpecificUser(user){
    let result = DB.Users.find(item => item.Name === user.userName && item.Password === user.userPassword);
    if(!!result)
        return result;
    result = {"Id" : -1};
    return result;
}


function _UserIndexOf(userArray ,userName){
    for(let i=0 ; i<userArray.length ; i++){
        if(userArray[i].Name === userName){
            return i;
        }
    }
    return -1;
}