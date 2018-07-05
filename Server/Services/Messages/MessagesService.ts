import {GetType} from "../../Helpers/MainHelpers";
import {DB} from "../../DB/DB";


export async function GetMessages(sender, receiver){
    return new Promise((resolve) => {
        const result = _GetMessages(sender,receiver);
        resolve(result);
    });
}
async function _GetMessages(sender, receiver){
    let resMessages;
    if(GetType(receiver) === 'group'){
        resMessages = await DB.AnyQuery(`SELECT id Id, content Content, sender_name SenderName, receiver_name ReceiverName,
                                                       sender_id SenderId, receiver_id ReceiverId, time_sent TimeSent
                                                From messages
                                                WHERE receiver_id = ${receiver.Id}`);
    }
    else {
        resMessages = await DB.AnyQuery(`SELECT id Id, content Content, sender_name SenderName, receiver_name ReceiverName,
                                                       sender_id SenderId, receiver_id ReceiverId, time_sent TimeSent
                                                From messages
                                                WHERE sender_id = ${sender.Id} AND receiver_id = ${receiver.Id}
                                                      OR
                                                      sender_id = ${receiver.Id} AND receiver_id = ${sender.Id}`);
    }
    return resMessages;
}

export function AddMessage(massage: any){
    return new Promise((res) => {
        _AddMessage(massage);
        res();
    });
}
async function _AddMessage(message: any){
    await DB.AnyQuery(DB.insert('messages (content, sender_name, receiver_name, sender_id, receiver_id, time_sent)', message.Content, message.SenderName, message.ReceiverName, message.SenderId, message.ReceiverId, message.TimeSent));
}