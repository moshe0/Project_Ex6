import {DB, db} from "../../DB/DB";


export function AddUser(user: any){
    return new Promise((resolve) => {
        const result = _AddUser(user);
        resolve(result);
    });
}
async function _AddUser(user: any){
    let count = await DB.AnyQuery(DB.select('COUNT(*) count', 'users', {field : 'name', value : user.Name}));

    if(count[0].count === 0){
        await DB.AnyQuery(DB.insert( 'users (name, password, age)', user.Name, user.Password, user.Age));
        return `succeeded! user '${user.Name}' added`;
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
async function _DeleteUser(userId: number){
    let count = await DB.AnyQuery(DB.select('COUNT(*) count, name', 'users', {field : 'id', value : userId}));
    if(count[0].count === 0)
        return 'failed';

    await DB.AnyQuery(DB.delete('users', {field : 'id', value : userId}));
    await DB.AnyQuery(DB.delete('members', {field : 'user_id', value : userId}));

    return `succeeded! user '${count[0].name}' deleted`;
}


export function UpdateUser(user: any){
    return new Promise((resolve) => {
        const result = _UpdateUser(user);
        resolve(result);
    });
}
async function _UpdateUser(user: any){
    let count = await DB.AnyQuery(DB.select('COUNT(*) count, name', 'users', {field : 'id', value : user.Id}));
    if(count[0].count === 0)
        return 'failed';

    await DB.AnyQuery(DB.update('users', {field : 'id', value : user.Id}, {field : 'password', value : user.Password}, {field : 'age', value : user.Age}));
    return `succeeded! user '${count[0].name}' updated`;
}


export function GetUsers(){
    return new Promise((resolve) => {
        let query = DB.select('id Id, name Name, password Password, age Age', 'users');
        db.query(query, (err, results) => {
            resolve(results);
        });
    });
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