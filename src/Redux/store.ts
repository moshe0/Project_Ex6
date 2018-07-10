import {Action, applyMiddleware, createStore, Dispatch, Unsubscribe} from "redux";
import thunk from "redux-thunk";
import {rootReducer} from "./reducers";
import {AppState} from "./AppState";


const initialState: AppState = {
    Data : null,
    currentUser : null,
    Receiver : null,
    HoldReceiver : null,
    ModalState : false,
    LogInState : true,
    AllTree : null,
    TreeSelected : null
};


interface AppStore {
    dispatch: Dispatch<Action | any>;
    getState(): AppState;
    subscribe(listener: () => void): Unsubscribe;
}

export const store: AppStore = createStore(
    rootReducer,
    initialState,
    applyMiddleware(thunk),
);