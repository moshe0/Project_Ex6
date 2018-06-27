import {Group} from "../Models/Group";
import {User} from "../Models/User";

export function GetNextId(obj : {Id}[]){
    let result = obj.map(item => item.Id);
    result.sort();

    let res=1;
    for(let i=0 ; i<result.length ; i++, res++) {
        if (result[i] !== res) {
            break;
        }
    }
    return res;
}

export function _GetGroupArrId(obj : Group){
    let groupArr = [];
    groupArr.push({"Id" : obj.Id});
    for(let item of obj.Members) {
        if(GetType(item) === 'user')
            break;
        groupArr = groupArr.concat(_GetGroupArrId(item));
    }
    return groupArr;
}

export function GetGroupNextId(obj : Group[]){
    let groupArr = [];
    for(let item of obj) {
        groupArr = groupArr.concat(_GetGroupArrId(item));
    }
    return GetNextId(groupArr);
}

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

export function GetUserByID(users : User[], id : number) {
    let userRet =  users.find( item => item.Id === id);
    if(!userRet)
        return null;
    return userRet;
}