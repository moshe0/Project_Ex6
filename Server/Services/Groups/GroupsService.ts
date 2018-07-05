import {DB2} from "../../DB/DB2";
import {GetGroupNextId, GetType} from "../../Helpers/MainHelpers";
import {Group} from "../../Models/Group";
import {User} from "../../Models/User";
import {DB, db} from "../../DB/DB";


export async function GetGroups(){
    try {
    let result: any = await getLastGroups();

    for(let i=0 ; i < result.length ; i++){
        result[i].Members = [];
        let members: any = await getMembers(result[i].Id);
        for(let item of members) {
            result[i].Members.push(await getGroupMember('id Id, name Name, password Password, age Age', 'users', item.user_id));
        }
    }

    for(let i=0 ; i < result.length ; i++){
        if(!!result[i].ParentId){
            result.splice(i, 0, await getSingleGroup('id Id, name Name, null Members, parent_id ParentId', 'groups', result[i].ParentId));
            result[i].Members = [];
            result[i].Members.push(result[i+1]);
            result.splice(i+1, 1);
            i--;
        }
    }

    let tmp = JSON.stringify(result, ["Id", "Name", "Members", "Password", "Age"]);
    result = JSON.parse(tmp);
    return result;
    } catch (e) {
        console.log(">>>>>>>>>>>. ERROR", e)
    }
}
function getLastGroups(){
    return new Promise((resolve) => {
        let query = 'SELECT id Id, name Name, null Members, parent_id ParentId FROM groups g1 WHERE NOT EXISTS (SELECT * FROM groups g2 WHERE g1.id = g2.parent_id)';
        db.query(query, (err, results) => {
            resolve(results);
        });
    });
}
function getMembers(Id : number){
    return new Promise((resolve) => {
        let query = DB.select('*', 'members', {field : 'host_id', value : Id});
        db.query(query, (err, results) => {
            resolve(results);
        });
    });
}
function getGroupMember(what: string, table: string, user_id : number){
    return new Promise((resolve) => {
        let query = DB.select(what, table, {field: 'id', value: user_id});
        db.query(query, (err, results) => {
            resolve(results[0]);
        });
    });
}
function getSingleGroup(what: string, table: string, parentId : number){
    return new Promise((resolve) => {
        let query = DB.select(what, table, {field: 'id', value: parentId});
        db.query(query, (err, results) => {
            resolve(results[0]);
        });
    });
}


export function AddGroup(group: any, newGroupName : string, parentId : number){
    return new Promise((resolve) => {
        let result = '';
        group.Id = GetGroupNextId(DB2.Groups);
        if(parentId === -1){
            result = _AddGroupDirectSon(group, parentId);
        }
        else if(newGroupName === group.Name && newGroupName !== '')
            result = 'failed! \'Name\' and \'New group name\' must be diffrent';
        else
            result = _AddGroup(group, newGroupName, parentId, null);
        resolve(result);
    });
}
function _AddGroup(group: any, newGroupName : string, parentId : number, parent ?: Group){
    let res = '';
    for(let item of DB2.Groups){
        res = _AddGroupItem(group, newGroupName, parentId, item, null);
        if(res === 'succeeded')
            return 'succeeded! group \'' + group.Name + '\' added';
        else if(res !== '')
            return res;
    }
    return 'failed';
}
function _AddGroupItem(group: any, newGroupName : string, parentId : number, node : Group, parent ?: Group) : string{
    let res = '';
    if(node.Id === parentId) {
        if (node.Members.find(item => item.Name === group.Name && GetType(item) === 'group'))
            return 'failed! group \'' + group.Name + '\' already exist';
        if (newGroupName !== '') {
            if (node.Members.find(item => item.Name === group.tmpMembers && GetType(item) === 'group'))
                return 'failed! group \'' + newGroupName + '\' already exist';
            const tmpMembers = node.Members.slice();
            node.Members = [];
            node.Members.push(group);
            let newGroup = new Group(GetGroupNextId(DB2.Groups), newGroupName, tmpMembers);
            node.Members.push(newGroup);
            return DB2.writeFile('Groups');
        }


        else {
            node.Members.push(group);
            return DB2.writeFile('Groups');
        }
    }
    for(let item of node.Members) {
        if(GetType(item) === 'user')
            break;
        res = _AddGroupItem(group, newGroupName, parentId, item, node);
        if(res === 'succeeded')
            return res;
        else if(res != '')
            return res;
    }
    return res;
}
function _AddGroupDirectSon(group: any, parentId : number){
    let index = DB2.Groups.findIndex(item => item.Name === group.Name);
    if(index > -1)
        return 'The group \'' + group.Name + '\' already exist';
    DB2.Groups.push(group);
    let result = DB2.writeFile('Groups');
    if(result === 'succeeded')
        return 'succeeded! group \'' + group.Name + '\' added!';
    return 'failed';
}




export function DeleteGroup(id: number, parentId : number){
    return new Promise((resolve) => {
        let result = '';
        if(parentId === -1)
            result = _DeleteGroupDirectSon(id, parentId);
        else
            result = _DeleteGroup(id, parentId);
        resolve(result);
    });
}
function _DeleteGroup(id: number, parentId : number){
    let res = '';
    for(let item of DB2.Groups){
        res = _DeleteGroupItem(id, parentId, item);
        if(res === 'succeeded')
            return res;
        else if(res !== '')
            return res;
    }
    return 'failed';
}
function _DeleteGroupItem(id : number, parentId : number, node : Group){
    let res = '';

    if(node.Id === parentId) {
        let index = node.Members.findIndex(item => item.Id === id && GetType(item) === 'group');
        if (index === -1)
            return 'failed! group not found';

        if(node.Members[index].Members.length === 0 || GetType(node.Members[index].Members[0]) === 'user') {
            let name = node.Members[index].Name;
            node.Members.splice(index, 1);
            DB2.writeFile('Groups');
            return 'succeeded! group \'' + name + '\' deleted!!!';
        }

        for(let elem of node.Members[index].Members) {
            let indexName = node.Members.findIndex(item => item.Name === elem.Name && GetType(item) === 'group' && item.Name !== node.Members[index].Name);
            if (indexName > -1)
                return 'failed! same name in one of members in \'' + node.Members[index].Name + '\' and in is brothers';
        }

        let name = node.Members[index].Name;
        node.Members.splice(index, 1, ...node.Members[index].Members);
        DB2.writeFile('Groups');
        return 'succeeded! group \'' + name + '\' deleted!!!'
    }
    for(let item of node.Members) {
        if(GetType(item) === 'user')
            break;
        let res = _DeleteGroupItem(id, parentId, item);
        if(res === 'succeeded')
            return res;
        else if(res != '')
            return res;
    }
    return res;
}
function _DeleteGroupDirectSon(id : number, parentId : number){
    let index = DB2.Groups.findIndex(item => item.Id === id && GetType(item) === 'group');
    if (index === -1)
        return 'failed! item selected not found';

    if(DB2.Groups[index].Members.length === 0 || GetType(DB2.Groups[index].Members[0]) === 'user') {
        DB2.Groups.splice(index, 1);
        return DB2.writeFile('Groups');
    }

    for(let elem of DB2.Groups[index].Members) {
        let indexName = DB2.Groups.findIndex(item => item.Name === elem.Name && GetType(item) === 'group' && item.Name !== DB2.Groups[index].Name);
        if (indexName > -1)
            return 'failed! same name in one of members in \'' + DB2.Groups[index].Name + '\' and in is brothers';
    }

    let name = DB2.Groups[index].Name;
    DB2.Groups.splice(index, 1, ...DB2.Groups[index].Members);
    DB2.writeFile('Groups');
    return 'succeeded! group \'' + name + '\' deleted';
}


export function FlatteningGroup(id: number, parentId : number){
    return new Promise((resolve) => {
        const result = _FlatteningGroup(id, parentId);
        resolve(result);
    });
}
function _FlatteningGroup(id: number, parentId : number){
    let name = DB2.Groups.find(item => item.Id === id  && GetType(item) === 'group');
    for(let item of DB2.Groups){
        if(_FlatteningGroupItem(id, parentId, item) === 'succeeded')
            return 'succeeded! group \'' + name + '\' flatted';
    }
    return 'failed';
}
function _FlatteningGroupItem(id : number, parentId : number, node : Group){
    if(node.Id === parentId) {
        node.Members = node.Members[0].Members;
        return DB2.writeFile('Groups');
    }
    for(let item of node.Members) {
        if(GetType(item) === 'user')
            break;
        let res = _FlatteningGroupItem(id, parentId, item);
        if(res === 'succeeded')
            return res;
    }
    return 'failed';
}





export function AddUserToExistingGroup(userName: string, parentId : number){
    return new Promise((resolve) => {
        let result = '';
        let user = DB2.Users.find(item => item.Name === userName);
        if(!user)
            result = 'failed! user \'' + userName + '\' not exist';
        else
            result = _AddUserToExistingGroup(user, parentId);
        resolve(result);
    });
}
function _AddUserToExistingGroup(user: User, parentId : number){
    let res = '';
    for(let item of DB2.Groups){
        res = _AddUserToExistingGroupItem(user, item, parentId);
        if(res === 'succeeded')
            return 'succeeded! user \'' + user.Name + '\' added to group';
        else if(res !== '')
            return res;
    }
    return 'failed';
}
function _AddUserToExistingGroupItem(user: User, node : Group, parentId : number){
    let res = '';

    if(node.Id === parentId) {
        if (node.Members.find(item => item.Name === user.Name && GetType(item) === 'user')) {
            return 'failed! user \'' + user.Name + '\' already exist';
        }
        node.Members.push(user);
        return DB2.writeFile('Groups');
    }
    for(let item of node.Members) {
        if(GetType(item) === 'user')
            break;
        let res = _AddUserToExistingGroupItem(user, item, parentId);
        if(res === 'succeeded')
            return res;
        else if(res !== '')
            return res;
    }
    return res;
}


export function DeleteUserFromGroup(userId : number, parentId : number){
    return new Promise((resolve) => {
        const user = DB2.Users.find(item => item.Id === userId);
        const result = _DeleteUserFromGroup(user.Name, parentId);
        resolve(result);
    });
}
function _DeleteUserFromGroup(userName : string, parentId : number){
    for(let item of DB2.Groups){
        if(_DeleteUserFromGroupItem(userName, parentId, item) === 'succeeded')
            return 'succeeded! user \'' + userName + '\' deleted from group';
    }
    return 'failed';
}
function _DeleteUserFromGroupItem(userName : string, parentId : number, node : Group){
    if(node.Id === parentId) {
        let index = node.Members.findIndex(item => item.Name === userName && GetType(item) === 'user');
        if (index === -1) {
            return 'failed';
        }
        node.Members.splice(index, 1);
        return DB2.writeFile('Groups');
    }
    for(let item of node.Members) {
        if(GetType(item) === 'user')
            break;
        let res = _DeleteUserFromGroupItem(userName, parentId, item);
        if(res === 'succeeded')
            return res;
    }
    return 'failed';
}