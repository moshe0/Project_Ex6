"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const routes = require("./Routes");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
app.use('/users', routes.UsersRouter);
app.use('/groups', routes.GroupsRouter);
app.use('/messages', routes.MessagesRouter);
exports.default = app;
//# sourceMappingURL=app.js.map