"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Controllers = require("../Controllers");
const GroupsRouter = express.Router();
GroupsRouter.get('/GetGroups', Controllers.GroupsController.GetGroups);
GroupsRouter.post('/AddGroup', Controllers.GroupsController.AddGroup);
GroupsRouter.delete('/DeleteGroup/:id/:parentId', Controllers.GroupsController.DeleteGroup);
GroupsRouter.delete('/FlatteningGroup/:id/:parentId', Controllers.GroupsController.FlatteningGroup);
GroupsRouter.post('/AddUserToExistingGroup', Controllers.GroupsController.AddUserToExistingGroup);
GroupsRouter.delete('/DeleteUserFromGroup/:userId/:parentId', Controllers.GroupsController.DeleteUserFromGroup);
exports.default = GroupsRouter;
//# sourceMappingURL=GroupsRouter.js.map