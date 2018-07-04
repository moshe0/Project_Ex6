import {DB2} from "../../DB/DB2";
import {Message} from "../../../src/Models/Message";
import {GetNextId, GetType} from "../../Helpers/MainHelpers";


export function GetMessages(sender, receiver){
    return new Promise((resolve) => {
        const result = _GetMessages(sender,receiver);
        resolve(result);
    });
}
function _GetMessages(sender, receiver){
    let resMessages : any[] = [];
    if(GetType(receiver) === 'group'){
        for (let i: number = 0; i < DB2.Messages.length; i++) {
            if (DB2.Messages[i].Receiving === receiver.Name)
                resMessages.push(DB2.Messages[i]);
        }
    }
    else {
        for (let i: number = 0; i < DB2.Messages.length; i++) {
            if (DB2.Messages[i].SendingUser === sender.Name && DB2.Messages[i].Receiving === receiver.Name ||
                DB2.Messages[i].SendingUser === receiver.Name && DB2.Messages[i].Receiving === sender.Name)
                resMessages.push(DB2.Messages[i]);
        }
    }
    return resMessages;
}

export function AddMessage(massage: any){
    return new Promise((res) => {
        _AddMessage(massage);
        res();
    });
}
function _AddMessage(message: any){
    if(! DB2.Messages)
        DB2.Messages = [];
    message.Id = GetNextId(DB2.Messages);
    DB2.Messages.push(message);
    DB2.writeFile('Messages');
}