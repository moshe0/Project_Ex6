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
function GetGroups(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield services.GroupsService.GetGroups();
        res.json(result);
    });
}
exports.GetGroups = GetGroups;
function AddGroup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield services.GroupsService.AddGroup(req.body['group'].group, req.body['newGroupName'].newGroupName, req.body['parentId'].parentId);
        res.json(result);
    });
}
exports.AddGroup = AddGroup;
function DeleteGroup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield services.GroupsService.DeleteGroup(req.body['id'].id, req.body['parentId'].parentId);
        res.json(result);
    });
}
exports.DeleteGroup = DeleteGroup;
function FlatteningGroup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield services.GroupsService.FlatteningGroup(req.body['id'].id, req.body['parentId'].parentId);
        res.json(result);
    });
}
exports.FlatteningGroup = FlatteningGroup;
function AddUserToExistingGroup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield services.GroupsService.AddUserToExistingGroup(req.body['userName'].userName, req.body['parentId'].parentId);
        res.json(result);
    });
}
exports.AddUserToExistingGroup = AddUserToExistingGroup;
function DeleteUserFromGroup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield services.GroupsService.DeleteUserFromGroup(req.body['userId'].userId, req.body['parentId'].parentId);
        res.json(result);
    });
}
exports.DeleteUserFromGroup = DeleteUserFromGroup;
//# sourceMappingURL=GroupsController.js.map