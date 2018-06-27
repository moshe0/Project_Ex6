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
const services = require("./../../Services");
function AddUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield services.UsersService.AddUser(req.body);
        res.json(result);
    });
}
exports.AddUser = AddUser;
function DeleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield services.UsersService.DeleteUser(req.body['userId'].userId);
        res.json(result);
    });
}
exports.DeleteUser = DeleteUser;
function UpdateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield services.UsersService.UpdateUser(req.body);
        res.json(result);
    });
}
exports.UpdateUser = UpdateUser;
function GetUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield services.UsersService.GetUsers();
        res.json(result);
    });
}
exports.GetUsers = GetUsers;
function GetSpecificUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield services.UsersService.GetSpecificUser(req.body);
        res.json(result);
    });
}
exports.GetSpecificUser = GetSpecificUser;
//# sourceMappingURL=UsersController.js.map