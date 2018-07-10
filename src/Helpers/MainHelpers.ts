import * as io from 'socket.io-client';
import StateStore from "../state/StateStore";


class MainHelpers {
    static FirstUse = 1;
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

MainHelpers.socket.on('chat', (names) => {
    let index = names.find(item => item === StateStore.getInstance().get('currentUser').Name);
    if(!! index) {
        StateStore.getInstance().onStoreChanged();
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