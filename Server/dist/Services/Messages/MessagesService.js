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
const MainHelpers_1 = require("../../Helpers/MainHelpers");
const DB_1 = require("../../DB/DB");
function GetMessages(sender, receiver) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            const result = _GetMessages(sender, receiver);
            resolve(result);
        });
    });
}
exports.GetMessages = GetMessages;
function _GetMessages(sender, receiver) {
    return __awaiter(this, void 0, void 0, function* () {
        let resMessages;
        if (MainHelpers_1.GetType(receiver) === 'group') {
            resMessages = yield DB_1.DB.AnyQuery(`SELECT id Id, content Content, sender_name SenderName, receiver_name ReceiverName,
                                                       sender_id SenderId, receiver_id ReceiverId, time_sent TimeSent
                                                From messages
                                                WHERE receiver_id = ${receiver.Id}`);
        }
        else {
            resMessages = yield DB_1.DB.AnyQuery(`SELECT id Id, content Content, sender_name SenderName, receiver_name ReceiverName,
                                                       sender_id SenderId, receiver_id ReceiverId, time_sent TimeSent
                                                From messages
                                                WHERE sender_id = ${sender.Id} AND receiver_id = ${receiver.Id}
                                                      OR
                                                      sender_id = ${receiver.Id} AND receiver_id = ${sender.Id}`);
        }
        return resMessages;
    });
}
function AddMessage(massage) {
    return new Promise((res) => {
        _AddMessage(massage);
        res();
    });
}
exports.AddMessage = AddMessage;
function _AddMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        yield DB_1.DB.AnyQuery(DB_1.DB.insert('messages (content, sender_name, receiver_name, sender_id, receiver_id, time_sent)', message.Content, message.SenderName, message.ReceiverName, message.SenderId, message.ReceiverId, message.TimeSent));
    });
}
//# sourceMappingURL=MessagesService.js.map