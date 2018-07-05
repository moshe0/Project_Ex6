"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function GetNextId(obj) {
    let result = obj.map(item => item.Id);
    result.sort();
    let res = 1;
    for (let i = 0; i < result.length; i++, res++) {
        if (result[i] !== res) {
            break;
        }
    }
    return res;
}
exports.GetNextId = GetNextId;
function _GetGroupArrId(obj) {
    let groupArr = [];
    groupArr.push({ "Id": obj.Id });
    for (let item of obj.Members) {
        if (GetType(item) === 'user')
            break;
        groupArr = groupArr.concat(_GetGroupArrId(item));
    }
    return groupArr;
}
exports._GetGroupArrId = _GetGroupArrId;
function GetGroupNextId(obj) {
    let groupArr = [];
    for (let item of obj) {
        groupArr = groupArr.concat(_GetGroupArrId(item));
    }
    return GetNextId(groupArr);
}
exports.GetGroupNextId = GetGroupNextId;
function GetType(Obj) {
    for (let propName in Obj) {
        if (propName === 'Members')
            return 'group';
    }
    return 'user';
}
exports.GetType = GetType;
function GetItems(Obj) {
    if (GetType(Obj) === 'user')
        return [];
    return Obj['Members'];
}
exports.GetItems = GetItems;
function GetUserByID(users, id) {
    let userRet = users.find(item => item.Id === id);
    if (!userRet)
        return null;
    return userRet;
}
exports.GetUserByID = GetUserByID;
//# sourceMappingURL=MainHelpers.js.map