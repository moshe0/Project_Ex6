export function GetType(Obj) : string{
    for(let propName in Obj) {
        if(propName === 'Members')
            return 'group';
    }
    return 'user';
}