import {TreeSelectedItem} from "../Models/TreeSelectedItem";
import {AppState} from "./AppState";


function setData(data: any[]){
    return {
        type: "SET_DATA",
        value: data,
    }
}

function setCurrentUser(user: {Name}){
    return {
        type: "SET_CURRENT_USER",
        value: user,
    }
}

function setReceiver(receiver: any){
    return {
        type: "SET_RECEIVER",
        value: receiver,
    }
}

function setHoldReceiver(holdReceiver: any){
    return {
        type: "SET_HOLD_RECEIVER",
        value: holdReceiver,
    }
}

function setModalState(modalState: boolean){
    return {
        type: "SET_MODAL_STATE",
        value: modalState,
    }
}

function setLogInState(logInState: boolean){
    return {
        type: "SET_LOGIN_STATE",
        value: logInState,
    }
}

function setAllTree(allTree: any){
    return {
        type: "SET_ALL_TREE",
        value: allTree,
    }
}

function setTreeSelected(treeItem: TreeSelectedItem){
    return {
        type: "SET_TREE_SELECTED",
        value: treeItem,
    }
}

function refresh(state: AppState) {
    return {
        type: "REFRESH",
        value: user,
    }
}