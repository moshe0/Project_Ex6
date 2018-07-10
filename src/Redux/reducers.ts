import {AnyAction} from "redux";
import {AppState} from "./AppState";
import {TreeSelectedItem} from "../Models/TreeSelectedItem";


const handlers = {
    "SET_DATA": setData,
    "SET_CURRENT_USER": setCurrentUser,
    "SET_RECEIVER":setReceiver,
    "SET_HOLD_RECEIVER":setHoldReceiver,
    "SET_MODAL_STATE":setModalState,
    "SET_LOGIN_STATE":setLogInState,
    "SET_ALL_TREE":setAllTree,
    "SET_TREE_SELECTED":setTreeSelected,
    "REFRESH": refresh,
};

export function rootReducer(state: AppState, action: AnyAction): AppState {
    const handler = handlers[action.type];
    if(handler)
        return handler(state, action.value);
    return state;
}



function setData(state: AppState, data: any[]): AppState {
    return {
        ...state,
        Data: data,
    }
}

function setCurrentUser(state: AppState, user: {Name}): AppState {
    return {
        ...state,
        currentUser: user,
    }
}

function setReceiver(state: AppState, receiver: any): AppState {
    return {
        ...state,
        Receiver: receiver,
    }
}

function setHoldReceiver(state: AppState, holdReceiver: any): AppState {
    return {
        ...state,
        HoldReceiver: holdReceiver,
    }
}

function setModalState(state: AppState, modalState: boolean): AppState {
    return {
        ...state,
        ModalState: modalState,
    }
}

function setLogInState(state: AppState, logInState: boolean): AppState {
    return {
        ...state,
        LogInState: logInState,
    }
}

function setAllTree(state: AppState, allTree: any): AppState {
    return {
        ...state,
        AllTree: allTree,
    }
}

function setTreeSelected(state: AppState, treeItem: TreeSelectedItem): AppState {
    return {
        ...state,
        TreeSelected: treeItem,
    }
}

function refresh(state: AppState) {
    return {
        ...state,
    }
}