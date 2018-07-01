"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Controllers = require("../Controllers");
const GroupsRouter = express.Router();
GroupsRouter.get('/GetGroups', Controllers.GroupsController.GetGroups);
GroupsRouter.post('/AddGroup', Controllers.GroupsController.AddGroup);
GroupsRouter.delete('/DeleteGroup', Controllers.GroupsController.DeleteGroup);
GroupsRouter.delete('/FlatteningGroup', Controllers.GroupsController.FlatteningGroup);
GroupsRouter.post('/AddUserToExistingGroup', Controllers.GroupsController.AddUserToExistingGroup);
GroupsRouter.delete('/DeleteUserFromGroup', Controllers.GroupsController.DeleteUserFromGroup);
exports.default = GroupsRouter;
//# sourceMappingURL=GroupsRouter.js.map