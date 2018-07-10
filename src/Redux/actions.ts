import {TreeSelectedItem} from "../Models/TreeSelectedItem";
import {AppState} from "./AppState";


export function setData(data: any[]){
    return {
        type: "SET_DATA",
        value: data,
    }
}

export function setCurrentUser(user: {Name}){
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