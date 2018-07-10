import {TreeSelectedItem} from "../Models/TreeSelectedItem";

export interface AppState {
    Data : any[];
    currentUser : {Name};
    Receiver : any;
    HoldReceiver : any;
    ModalState : boolean;
    LogInState : boolean;
    AllTree : any;
    TreeSelected : TreeSelectedItem;
}