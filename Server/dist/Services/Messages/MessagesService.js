"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB/DB");
const MainHelpers_1 = require("../../Helpers/MainHelpers");
const uuidv4 = require("uuid/v4");
function GetMessages(sender, receiver) {
    return new Promise((resolve) => {
        const result = _GetMessages(sender, receiver);
        resolve(result);
    });
}
exports.GetMessages = GetMessages;
function _GetMessages(sender, receiver) {
    let resMessages = [];
    if (MainHelpers_1.GetType(receiver) === 'group') {
        for (let i = 0; i < DB_1.DB.Messages.length; i++) {
            if (DB_1.DB.Messages[i].ReceiverId === receiver.Id)
                resMessages.push(DB_1.DB.Messages[i]);
        }
    }
    else {
        for (let i = 0; i < DB_1.DB.Messages.length; i++) {
            if (DB_1.DB.Messages[i].SenderId === sender.Id && DB_1.DB.Messages[i].ReceiverId === receiver.Id ||
                DB_1.DB.Messages[i].SenderId === receiver.Id && DB_1.DB.Messages[i].ReceiverId === sender.Id)
                resMessages.push(DB_1.DB.Messages[i]);
        }
    }
    return resMessages;
}
function AddMessage(massage) {
    return new Promise((res) => {
        _AddMessage(massage);
        res();
    });
}
exports.AddMessage = AddMessage;
function _AddMessage(message) {
    if (!DB_1.DB.Messages)
        DB_1.DB.Messages = [];
    message.Id = uuidv4();
    DB_1.DB.Messages.push(message);
    DB_1.DB.writeFile('Messages');
}
//# sourceMappingURL=MessagesService.js.map