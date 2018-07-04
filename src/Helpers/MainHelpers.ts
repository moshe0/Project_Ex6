export function GetType(Obj) : string{
    for(let propName in Obj) {
        if(propName === 'Members')
            return 'group';
    }
    return 'user';
}

export function GetItems(Obj) : any[]{
    if(GetType(Obj) === 'user')
        return [];
    return Obj['Members'];
}

export function RenameProp(oldProp, newProp, { [oldProp]: old, ...others  }){
    return {
        [newProp]: old,
        ...others
    };
}


