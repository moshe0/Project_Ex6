import * as io from 'socket.io-client';
import {store} from "../Redux/store";
import {appService} from "../AppService";
import {setMessages} from "../Redux/actions";


class MainHelpers {
    static FirstUse = 1;
    static inputReset = 0;
    static socket = io('http://localhost:4000');


    static GetType(Obj): string {
        for (let propName in Obj) {
            if (propName === 'Members')
                return 'group';
        }
        return 'user';
    }

    static GetItems(Obj): any[] {
        if (MainHelpers.GetType(Obj) === 'user')
            return [];
        return Obj['Members'];
    }
}

MainHelpers.socket.on('chat', async(names) => {
    let index = names.find(item => item === store.getState()['currentUser'].Name);
    if(!! index) {
        const resMessages = await appService.GetMessages(store.getState()['currentUser'], store.getState()['Receiver']);
        store.dispatch(setMessages(resMessages));
    }
});

export default MainHelpers;








/*
export function RenameProp(oldProp, newProp, { [oldProp]: old, ...others  }){
    return {
        [newProp]: old,
        ...others
    };
}


for(let i=0 ; i<ObjUsers.length ; i++){
    ObjUsers[i] = RenameProp('age', 'Age', ObjUsers[i]);
    ObjUsers[i] = RenameProp('password', 'Password', ObjUsers[i]);
    ObjUsers[i] = RenameProp('name', 'Name', ObjUsers[i]);
    ObjUsers[i] = RenameProp('id', 'Id', ObjUsers[i]);
}


*/