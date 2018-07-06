"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB/DB");
function AddUser(user) {
    return new Promise((resolve) => {
        const result = _AddUser(user);
        resolve(result);
    });
}
exports.AddUser = AddUser;
function _AddUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let count = yield DB_1.DB.AnyQuery(DB_1.DB.select('COUNT(*) count', 'users', { field: 'name', value: user.Name }));
        if (count[0].count === 0) {
            yield DB_1.DB.AnyQuery(DB_1.DB.insert('users (name, password, age)', user.Name, user.Password, user.Age));
            return `succeeded! user '${user.Name}' added`;
        }
        else
            return 'failed! The user is already exists';
    });
}
function DeleteUser(userId) {
    return new Promise((resolve) => {
        const result = _DeleteUser(userId);
        resolve(result);
    });
}
exports.DeleteUser = DeleteUser;
function _DeleteUser(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        let count = yield DB_1.DB.AnyQuery(DB_1.DB.select('COUNT(*) count, name', 'users', { field: 'id', value: userId }));
        if (count[0].count === 0)
            return 'failed';
        yield DB_1.DB.AnyQuery(DB_1.DB.delete('users', { field: 'id', value: userId }));
        yield DB_1.DB.AnyQuery(DB_1.DB.delete('members', { field: 'user_id', value: userId }));
        return `succeeded! user '${count[0].name}' deleted`;
    });
}
function UpdateUser(user) {
    return new Promise((resolve) => {
        const result = _UpdateUser(user);
        resolve(result);
    });
}
exports.UpdateUser = UpdateUser;
function _UpdateUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        let count = yield DB_1.DB.AnyQuery(DB_1.DB.select('COUNT(*) count, name', 'users', { field: 'id', value: user.Id }));
        if (count[0].count === 0)
            return 'failed';
        yield DB_1.DB.AnyQuery(DB_1.DB.update('users', { field: 'id', value: user.Id }, { field: 'password', value: user.Password }, { field: 'age', value: user.Age }));
        return `succeeded! user '${count[0].name}' updated`;
    });
}
function GetUsers() {
    return new Promise((resolve) => {
        let query = DB_1.DB.select('id Id, name Name, password Password, age Age', 'users');
        DB_1.db.query(query, (err, results) => {
            resolve(results);
        });
    });
}
exports.GetUsers = GetUsers;
function GetSpecificUser(user) {
    return new Promise((resolve) => {
        let query = DB_1.DB.select('*', 'users', { field: 'name', value: user.userName }, { field: 'password', value: user.userPassword });
        DB_1.db.query(query, (err, results) => {
            if (results.length === 0)
                resolve({ "Id": -1 });
            else
                resolve(results[0]);
        });
    });
}
exports.GetSpecificUser = GetSpecificUser;
//# sourceMappingURL=UsersService.js.map