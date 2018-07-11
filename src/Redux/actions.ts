import {TreeSelectedItem} from "../Models/TreeSelectedItem";
import {AppState} from "./AppState";
import MainHelpers from "../Helpers/MainHelpers";
import {appService} from "../AppService";


export function doLogin(user: {Name, Password}) {
    return async function(dispatch) {
        const LoginUser = await appService.GetSpecificUser(user.Name, user.Password);
        console.log(LoginUser);
        if(!LoginUser) {
            dispatch(setMessageErr('There is no connection!'));
            return;
        }
        else if(LoginUser.Id === -1) {
            dispatch(setMessageErr('User name or password incorrect!'));
            return;
        }
        else {
            const Data = await appService.GetData();

            if (!!LoginUser && !!Data) {
                MainHelpers.FirstUse = 1;
                dispatch(setMany({'currentUser': LoginUser, 'Data': Data, 'ModalState': false, 'LogInState': false}));
            }
        }
    }
}


export function doChangeErr(err : string) {
    return async function(dispatch) {
        dispatch(setMessageErr(err));
    }
}












export function setData(data: any[]){
    return {
        type: "SET_DATA",
        value: data,
    }
}

export function setCurrentUser(user: {Name, Password}){
    return {
        type: "SET_CURRENT_USER",
        value: user,
    }
}

export function setReceiver(receiver: any){
    return {
        type: "SET_RECEIVER",
        value: receiver,
    }
}

export function setHoldReceiver(holdReceiver: any){
    return {
        type: "SET_HOLD_RECEIVER",
        value: holdReceiver,
    }
}

export function setModalState(modalState: boolean){
    return {
        type: "SET_MODAL_STATE",
        value: modalState,
    }
}

export function setLogInState(logInState: boolean){
    return {
        type: "SET_LOGIN_STATE",
        value: logInState,
    }
}

export function setAllTree(allTree: any){
    return {
        type: "SET_ALL_TREE",
        value: allTree,
    }
}

export function setTreeSelected(treeItem: TreeSelectedItem){
    return {
        type: "SET_TREE_SELECTED",
        value: treeItem,
    }
}

export function refresh(state: AppState) {
    return {
        type: "REFRESH",
        value: user,
    }
}

export function setMessageErr(message: string) {
    return {
        type: "SET_MESSAGE_ERR",
        value: message,
    }
}

export function setMessages(messages: any[]) {
    return {
        type: "SET_MESSAGES",
        value: messages,
    }
}

export function setMany(obj: {}) {
    return {
        type: "SET_MANY",
        value: obj,
    }
}