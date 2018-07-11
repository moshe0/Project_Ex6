import {TreeSelectedItem} from "../Models/TreeSelectedItem";

export interface AppState {
    Data : any[];
    currentUser : {Id: number, Name : string, Password : string};
    Receiver : any;
    HoldReceiver : any;
    ModalState : boolean;
    LogInState : boolean;
    AllTree : any;
    TreeSelected : TreeSelectedItem;
    MessageErr : string;
    Messages : any[];
}