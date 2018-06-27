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
function GetMessages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield services.MessagesService.GetMessages(req.body['sender'].sender, req.body['receiver'].receiver);
        res.json(result);
    });
}
exports.GetMessages = GetMessages;
function AddMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield services.MessagesService.AddMessage(req.body);
        res.json(result);
    });
}
exports.AddMessage = AddMessage;
//# sourceMappingURL=MessagesController.js.map