import {DB2} from "../../DB/DB2";
import {GetGroupNextId, GetType} from "../../Helpers/MainHelpers";
import {Group} from "../../Models/Group";
import {User} from "../../Models/User";
import {DB, db} from "../../DB/DB";


export async function GetGroups(){
    try {
        // Select the last groups
        let result: any = await await DB.AnyQuery
        ( `SELECT aa1.id Id, aa1.name Name, null Members, aa1.parent_id ParentId
                 FROM
                 	(SELECT id , name, null Members, parent_id
                 	FROM groups g1 
                 	WHERE NOT EXISTS (SELECT * FROM groups g2 WHERE g1.id = g2.parent_id)) aa1
                 WHERE aa1.parent_id IS NULL OR aa1.parent_id not in 
                 	(SELECT parent_id
                 	FROM groups g3
                 	WHERE g3.parent_id IS NOT NULL AND EXISTS (SELECT * FROM groups g4 WHERE g3.id = g4.parent_id))`);


        // Find the user associated to them
        for(let i=0 ; i < result.length ; i++){
            result[i].Members = [];
            let members: any = await DB.AnyQuery(DB.select('*',
                                                           'members',
                                                           {field : 'host_id', value : result[i].Id}));
            for(let item of members) {
                result[i].Members.push(await DB.AnyQuery(DB.select('id Id, name Name, password Password, age Age',
                                                                   'users',
                                                                   {field: 'id', value: item.user_id}), true));
            }
        }

        // Build the tree
        for(let i=0 ; i < result.length ; i++){
            if(!!result[i].ParentId) {
                result.splice(i, 0, await DB.AnyQuery(DB.select('id Id, name Name, null Members, parent_id ParentId',
                    'groups',
                    {field: 'id', value: result[i].ParentId}), true));
                result[i].Members = [];

                let children : any = await DB.AnyQuery(DB.select('id Id, name Name, null Members, parent_id ParentId',
                                                           'groups',
                                                           {field: 'parent_id', value: result[i+1].ParentId}));
                for(let j=0 ; j<children.length ; j++){
                    children[j].Members = [];
                }
                let index : number;
                for(let j=0 ; j<children.length ; j++) {
                    index = result.findIndex(val => val.Id === children[j].Id);
                    if(index !== -1) {
                        children[j] = Object.assign({}, result[index]);
                        result.splice(index, 1);
                    }
                    result[i].Members.push(children[j]);
                }
                --i;
            }
        }

        //union tree nodes
        for(let i=0 ; i < result.length-1 ; i++)
            for(let j=i+1 ; j < result.length ; j++) {
                if (result[i].Id === result[j].Id) {
                    BuildTreeHelper(result[i], result[j]);
                    result.splice(j, 1);
                }
            }

        // Erase not necessary properties
        let tmp = JSON.stringify(result, ["Id", "Name", "Members", "Password", "Age"]);
        result = JSON.parse(tmp);
        return result;
    }
    catch (e) {
        console.log(">>>>>>>>>>>. ERROR", e)
    }
}
function BuildTreeHelper(resultA : any, resultB : any){
    for(let i=0 ; i < resultA.Members.length ; i++){
        if(resultA.Members[i].Members.length < resultB.Members[i].Members.length) {
            resultA.Members[i] = resultB.Members[i];
            return true;
        }
    }
    for(let i=0 ; i < resultA.Members.length ; i++){
        if(BuildTreeHelper(resultA.Members[i], resultB.Members[i]) === true)
            return true;
    }
    return false;
}


export function AddGroup(group: any, newGroupName : string, parentId : number){
    return new Promise((resolve) => {
        let result : Promise<string>;
        if(parentId === -1)
            result = _AddGroupDirectSon(group, parentId);
        else
            result = _AddGroup(group, newGroupName, parentId);
        resolve(result);
    });
}
    async function _AddGroup(group: any, newGroupName : string, parentId : number) {
    if (newGroupName === group.Name && newGroupName !== '')
        return `failed! 'Name' and 'New group name' must be diffrent`;

    let count = await DB.AnyQuery(DB.select('COUNT(*) count, name', 'groups',
        {field: 'parent_id', value: parentId}, {field: 'name', value: group.Name}));
    if (count[0].count > 0)
        return `The group '${group.Name}' already exist`;

    if (newGroupName === '') {
        await DB.AnyQuery(DB.insert('groups (name, parent_id)', group.Name, parentId));
        return `succeeded! group '${group.Name}' added`;
    }
    else {
        let count = await DB.AnyQuery(DB.select('COUNT(*) count, name', 'groups',
            {field: 'parent_id', value: parentId}, {field: 'name', value: newGroupName}));
        if (count[0].count > 0)
            return `The group '${newGroupName}' already exist`;
        await DB.AnyQuery(DB.insert('groups (name, parent_id)', group.Name, parentId));
        let newGroupNameObj : any = await DB.AnyQuery(DB.insert('groups (name, parent_id)', newGroupName, parentId));
        await DB.AnyQuery(DB.update('members', {field: 'host_id', value: parentId}, {field: 'host_id', value: newGroupNameObj.insertId}));
        return `succeeded! groups: '${group.Name}', '${newGroupName}' added`;
    }
}
async function _AddGroupDirectSon(group: any, parentId : number){
    let count = await DB.AnyQuery(DB.select('COUNT(*) count, name', 'groups', {field : 'name', value : group.Name}, {field : 'parent_id', value : null}));

    if(count[0].count > 0)
        return `The group '${group.Name}' already exist`;

    await DB.AnyQuery(DB.insert( 'groups (name)', group.Name));
    return `succeeded! group '${group.Name}' added!`;
}




export function DeleteGroup(id: number, parentId : number){
    return new Promise((resolve) => {
        let result : Promise<string>;
        if(parentId === -1)
            parentId = null;
        result = _DeleteGroup(id, parentId);
        resolve(result);
    });
}
async function _DeleteGroup(id: number, parentId : number) {
    let count = await DB.AnyQuery(DB.select('COUNT(*) count',
        'members',
        {field: 'host_id', value: id}));

    let deleteGroup = await DB.AnyQuery(DB.select('name, parent_id',
        'groups',
        {field: 'id', value: id}));
    // if children are users
    if (count[0].count > 0) {
        await DB.AnyQuery(DB.delete('members', {field: 'host_id', value: id}));
        await DB.AnyQuery(DB.delete('groups', {field: 'id', value: id}));
        return `succeeded! group '${deleteGroup[0].name}' deleted`;
    }

    // if children are groups
    let children: any = await DB.AnyQuery(DB.select('*',
        'groups',
        {field: 'parent_id', value: id}));

    // take deleteGroup children
    if (children.length === 0) {
        await DB.AnyQuery(DB.delete('groups', {field: 'id', value: id}));
        return `succeeded! group '${deleteGroup[0].name}' deleted`;
    }

    for (let item of children) {
        let brothers = await DB.AnyQuery(DB.select('COUNT(*) count',
            'groups',
            {field: 'parent_id', value: parentId}, {field: 'name', value: item.name}));
        if (brothers[0].count > 0)
            return `failed! same name in one of members in '${deleteGroup[0].name}' and in is brothers`;
    }
    await DB.AnyQuery(DB.update('groups', {field: 'parent_id', value: id}, {field: 'parent_id', value: parentId}));
    await DB.AnyQuery(DB.delete('groups', {field: 'id', value: id}));
    return `succeeded! group '${deleteGroup[0].name}' deleted`;
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
            return `succeeded! group '${name}' flatted`;
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
            result = `failed! user '${userName}' not exist`;
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
            return `succeeded! user '${user.Name}' added to group`;
        else if(res !== '')
            return res;
    }
    return 'failed';
}
function _AddUserToExistingGroupItem(user: User, node : Group, parentId : number){
    let res = '';

    if(node.Id === parentId) {
        if (node.Members.find(item => item.Name === user.Name && GetType(item) === 'user')) {
            return `failed! user '${user.Name}' already exis`;
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
            return `succeeded! user '${userName}' deleted from group`;
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