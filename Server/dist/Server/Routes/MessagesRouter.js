"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Controllers = require("../Controllers");
const MessagesRouter = express.Router();
MessagesRouter.post('/GetMessages', Controllers.MessagesController.GetMessages);
MessagesRouter.post('/AddMessage', Controllers.MessagesController.AddMessage);
exports.default = MessagesRouter;
//# sourceMappingURL=MessagesRouter.js.map