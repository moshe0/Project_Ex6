"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB2_1 = require("../../DB/DB2");
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
        for (let i = 0; i < DB2_1.DB2.Messages.length; i++) {
            if (DB2_1.DB2.Messages[i].Receiving === receiver.Name)
                resMessages.push(DB2_1.DB2.Messages[i]);
        }
    }
    else {
        for (let i = 0; i < DB2_1.DB2.Messages.length; i++) {
            if (DB2_1.DB2.Messages[i].SendingUser === sender.Name && DB2_1.DB2.Messages[i].Receiving === receiver.Name ||
                DB2_1.DB2.Messages[i].SendingUser === receiver.Name && DB2_1.DB2.Messages[i].Receiving === sender.Name)
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
    message.Id = MainHelpers_1.GetNextId(DB2_1.DB2.Messages);
    DB2_1.DB2.Messages.push(message);
    DB2_1.DB2.writeFile('Messages');
}
//# sourceMappingURL=MessagesService.js.map