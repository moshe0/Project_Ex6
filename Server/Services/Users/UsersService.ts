import {DB, db} from "../../DB/DB";
import {DB2} from "../../DB/DB2";
import {GetNextId} from "../../Helpers/MainHelpers";



export function AddUser(user: any){
    return new Promise((resolve) => {
        const result = _AddUser(user);
        resolve(result);
    });
}
function _AddUser(user: any){
    if(_UserIndexOf(DB2.Users, user.Name) === -1) {
        user.Id = GetNextId(DB2.Users);
        DB2.Users.push(Object.assign({}, user));
        DB2.writeFile('Users');
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
    let index = DB2.Users.findIndex(item => item.Id === userId);
    if(index === -1)
        return 'failed';
    let userName = DB2.Users[index].Name;
    DB2.Users.splice(index, 1);
    let result = DB2.writeFile('Users');
    if(result === 'succeeded') {
        result = DB2.writeFile('Groups');
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
    let index = DB2.Users.findIndex(item => item.Id === user.Id);
    DB2.Users[index].Password = user.Password;
    DB2.Users[index].Age = user.Age;
    let result = DB2.writeFile('Users');
    if(result === 'succeeded')
        return 'succeeded! user \'' + user.Name + '\' updated';
    return 'failed';
}


export function GetUsers(){
    return new Promise((resolve) => {
        let query = DB.select('*', 'users');
        db.query(query, (err, results) => {
            resolve(results);
        });
    });
}
function _GetUsers(){
    return DB2.Users;
}


export function GetSpecificUser(user){
    return new Promise((resolve) => {
        let query = DB.select('*', 'users', {field : 'name', value : user.userName}, {field : 'password', value : user.userPassword});
        db.query(query, (err, results) => {
            if(results.length === 0)
                resolve({"Id" : -1});
            else
                resolve(results[0]);
        });
    });
}


function _UserIndexOf(userArray ,userName){
    for(let i=0 ; i<userArray.length ; i++){
        if(userArray[i].Name === userName){
            return i;
        }
    }
    return -1;
}