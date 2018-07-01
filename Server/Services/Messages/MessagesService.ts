import {DB} from "../../DB/DB";
import {GetType} from "../../Helpers/MainHelpers";
import * as uuidv4 from 'uuid/v4';
import {Message} from "../../Models/Message";


export function GetMessages(sender, receiver){
    return new Promise((resolve) => {
        const result = _GetMessages(sender,receiver);
        resolve(result);
    });
}
function _GetMessages(sender, receiver){
    let resMessages : any[] = [];
    if(GetType(receiver) === 'group'){
        for (let i: number = 0; i < DB.Messages.length; i++) {
            if (DB.Messages[i].ReceiverId === receiver.Id)
                resMessages.push(DB.Messages[i]);
        }
    }
    else {
        for (let i: number = 0; i < DB.Messages.length; i++) {
            if (DB.Messages[i].SenderId === sender.Id && DB.Messages[i].ReceiverId === receiver.Id ||
                DB.Messages[i].SenderId === receiver.Id && DB.Messages[i].ReceiverId === sender.Id)
                resMessages.push(DB.Messages[i]);
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
    if(! DB.Messages)
        DB.Messages = [];
    message.Id = uuidv4();
    DB.Messages.push(message);
    DB.writeFile('Messages');
}