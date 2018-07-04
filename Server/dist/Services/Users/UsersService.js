"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB2_1 = require("../../DB/DB2");
const uuidv4 = require("uuid/v4");
const DB_1 = require("../../DB/DB");
function AddUser(user) {
    return new Promise((resolve) => {
        const result = _AddUser(user);
        resolve(result);
    });
}
exports.AddUser = AddUser;
function _AddUser(user) {
    if (_UserIndexOf(DB2_1.DB2.Users, user.Name) === -1) {
        user.Id = uuidv4();
        DB2_1.DB2.Users.push(Object.assign({}, user));
        DB2_1.DB2.writeFile('Users');
        return 'succeeded! user \'' + user.Name + '\' added';
    }
    else
        return 'failed! The user is already exists';
}
function DeleteUser(userId) {
    return new Promise((resolve) => {
        const result = _DeleteUser(userId);
        resolve(result);
    });
}
exports.DeleteUser = DeleteUser;
function _DeleteUser(userId) {
    let index = DB2_1.DB2.Users.findIndex(item => item.Id === userId);
    if (index === -1)
        return 'failed';
    let userName = DB2_1.DB2.Users[index].Name;
    DB2_1.DB2.Users.splice(index, 1);
    let result = DB2_1.DB2.writeFile('Users');
    if (result === 'succeeded') {
        result = DB2_1.DB2.writeFile('Groups');
        if (result === 'succeeded')
            return 'succeeded! user \'' + userName + '\' deleted';
        return 'failed';
    }
    return 'failed';
}
function UpdateUser(user) {
    return new Promise((resolve) => {
        const result = _UpdateUser(user);
        resolve(result);
    });
}
exports.UpdateUser = UpdateUser;
function _UpdateUser(user) {
    let index = DB2_1.DB2.Users.findIndex(item => item.Id === user.Id);
    DB2_1.DB2.Users[index].Password = user.Password;
    DB2_1.DB2.Users[index].Age = user.Age;
    let result = DB2_1.DB2.writeFile('Users');
    if (result === 'succeeded')
        return 'succeeded! user \'' + user.Name + '\' updated';
    return 'failed';
}
function GetUsers() {
    return new Promise((resolve) => {
        let query = DB_1.DB.select('*', 'users');
        DB_1.db.query(query, (err, results) => {
            DB2_1.DB2.Users;
            resolve(results);
        });
    });
}
exports.GetUsers = GetUsers;
function _GetUsers() {
    return DB2_1.DB2.Users;
}
function GetSpecificUser(user) {
    return new Promise((resolve) => {
        let query = DB_1.DB.select('*', 'users', { field: 'name', value: user.userName }, { field: 'password', value: user.userPassword });
        DB_1.db.query(query, (err, results) => {
            if (results.length === 0)
                resolve({ "Id": '-1' });
            else
                resolve(results[0]);
        });
    });
}
exports.GetSpecificUser = GetSpecificUser;
function _UserIndexOf(userArray, userName) {
    for (let i = 0; i < userArray.length; i++) {
        if (userArray[i].Name === userName) {
            return i;
        }
    }
    return -1;
}
//# sourceMappingURL=UsersService.js.map