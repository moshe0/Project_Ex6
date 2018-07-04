"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB2_1 = require("../../DB/DB2");
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
        for (let i = 0; i < DB2_1.DB2.Messages.length; i++) {
            if (DB2_1.DB2.Messages[i].ReceiverId === receiver.Id)
                resMessages.push(DB2_1.DB2.Messages[i]);
        }
    }
    else {
        for (let i = 0; i < DB2_1.DB2.Messages.length; i++) {
            if (DB2_1.DB2.Messages[i].SenderId === sender.Id && DB2_1.DB2.Messages[i].ReceiverId === receiver.Id ||
                DB2_1.DB2.Messages[i].SenderId === receiver.Id && DB2_1.DB2.Messages[i].ReceiverId === sender.Id)
                resMessages.push(DB2_1.DB2.Messages[i]);
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
    if (!DB2_1.DB2.Messages)
        DB2_1.DB2.Messages = [];
    message.Id = uuidv4();
    DB2_1.DB2.Messages.push(message);
    DB2_1.DB2.writeFile('Messages');
}
//# sourceMappingURL=MessagesService.js.map