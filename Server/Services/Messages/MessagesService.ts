import {DB} from "../../DB/DB";
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
        for (let i: number = 0; i < DB.Messages.length; i++) {
            if (DB.Messages[i].Receiving === receiver.Name)
                resMessages.push(DB.Messages[i]);
        }
    }
    else {
        for (let i: number = 0; i < DB.Messages.length; i++) {
            if (DB.Messages[i].SendingUser === sender.Name && DB.Messages[i].Receiving === receiver.Name ||
                DB.Messages[i].SendingUser === receiver.Name && DB.Messages[i].Receiving === sender.Name)
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
    message.Id = GetNextId(DB.Messages);
    DB.Messages.push(message);
    DB.writeFile('Messages');
}