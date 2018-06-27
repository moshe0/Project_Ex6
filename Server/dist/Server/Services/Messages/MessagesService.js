"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("../../DB/DB");
const MainHelpers_1 = require("../../Helpers/MainHelpers");
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
            if (DB_1.DB.Messages[i].Receiving === receiver.Name)
                resMessages.push(DB_1.DB.Messages[i]);
        }
    }
    else {
        for (let i = 0; i < DB_1.DB.Messages.length; i++) {
            if (DB_1.DB.Messages[i].SendingUser === sender.Name && DB_1.DB.Messages[i].Receiving === receiver.Name ||
                DB_1.DB.Messages[i].SendingUser === receiver.Name && DB_1.DB.Messages[i].Receiving === sender.Name)
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
    message.Id = MainHelpers_1.GetNextId(DB_1.DB.Messages);
    DB_1.DB.Messages.push(message);
    DB_1.DB.writeFile('Messages');
}
//# sourceMappingURL=MessagesService.js.map