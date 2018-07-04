"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB2_1 = require("../../DB/DB2");
const MainHelpers_1 = require("../../Helpers/MainHelpers");
const Group_1 = require("../../Models/Group");
function GetGroups() {
    return new Promise((resolve) => {
        const result = _GetGroups();
        resolve(result);
    });
}
exports.GetGroups = GetGroups;
function _GetGroups() {
    return DB2_1.DB2.Groups;
}
function AddGroup(group, newGroupName, parentId) {
    return new Promise((resolve) => {
        let result = '';
        group.Id = MainHelpers_1.GetGroupNextId(DB2_1.DB2.Groups);
        if (parentId === -1) {
            result = _AddGroupDirectSon(group, parentId);
        }
        else if (newGroupName === group.Name && newGroupName !== '')
            result = 'failed! \'Name\' and \'New group name\' must be diffrent';
        else
            result = _AddGroup(group, newGroupName, parentId, null);
        resolve(result);
    });
}
exports.AddGroup = AddGroup;
function _AddGroup(group, newGroupName, parentId, parent) {
    let res = '';
    for (let item of DB2_1.DB2.Groups) {
        res = _AddGroupItem(group, newGroupName, parentId, item, null);
        if (res === 'succeeded')
            return 'succeeded! group \'' + group.Name + '\' added';
        else if (res !== '')
            return res;
    }
    return 'failed';
}
function _AddGroupItem(group, newGroupName, parentId, node, parent) {
    let res = '';
    if (node.Id === parentId) {
        if (node.Members.find(item => item.Name === group.Name && MainHelpers_1.GetType(item) === 'group'))
            return 'failed! group \'' + group.Name + '\' already exist';
        if (newGroupName !== '') {
            if (node.Members.find(item => item.Name === group.tmpMembers && MainHelpers_1.GetType(item) === 'group'))
                return 'failed! group \'' + newGroupName + '\' already exist';
            const tmpMembers = node.Members.slice();
            node.Members = [];
            node.Members.push(group);
            let newGroup = new Group_1.Group(MainHelpers_1.GetGroupNextId(DB2_1.DB2.Groups), newGroupName, tmpMembers);
            node.Members.push(newGroup);
            return DB2_1.DB2.writeFile('Groups');
        }
        else {
            node.Members.push(group);
            return DB2_1.DB2.writeFile('Groups');
        }
    }
    for (let item of node.Members) {
        if (MainHelpers_1.GetType(item) === 'user')
            break;
        res = _AddGroupItem(group, newGroupName, parentId, item, node);
        if (res === 'succeeded')
            return res;
        else if (res != '')
            return res;
    }
    return res;
}
function _AddGroupDirectSon(group, parentId) {
    let index = DB2_1.DB2.Groups.findIndex(item => item.Name === group.Name);
    if (index > -1)
        return 'The group \'' + group.Name + '\' already exist';
    DB2_1.DB2.Groups.push(group);
    let result = DB2_1.DB2.writeFile('Groups');
    if (result === 'succeeded')
        return 'succeeded! group \'' + group.Name + '\' added!';
    return 'failed';
}
function DeleteGroup(id, parentId) {
    return new Promise((resolve) => {
        let result = '';
        if (parentId === -1)
            result = _DeleteGroupDirectSon(id, parentId);
        else
            result = _DeleteGroup(id, parentId);
        resolve(result);
    });
}
exports.DeleteGroup = DeleteGroup;
function _DeleteGroup(id, parentId) {
    let res = '';
    for (let item of DB2_1.DB2.Groups) {
        res = _DeleteGroupItem(id, parentId, item);
        if (res === 'succeeded')
            return res;
        else if (res !== '')
            return res;
    }
    return 'failed';
}
function _DeleteGroupItem(id, parentId, node) {
    let res = '';
    if (node.Id === parentId) {
        let index = node.Members.findIndex(item => item.Id === id && MainHelpers_1.GetType(item) === 'group');
        if (index === -1)
            return 'failed! group not found';
        if (node.Members[index].Members.length === 0 || MainHelpers_1.GetType(node.Members[index].Members[0]) === 'user') {
            let name = node.Members[index].Name;
            node.Members.splice(index, 1);
            DB2_1.DB2.writeFile('Groups');
            return 'succeeded! group \'' + name + '\' deleted!!!';
        }
        for (let elem of node.Members[index].Members) {
            let indexName = node.Members.findIndex(item => item.Name === elem.Name && MainHelpers_1.GetType(item) === 'group' && item.Name !== node.Members[index].Name);
            if (indexName > -1)
                return 'failed! same name in one of members in \'' + node.Members[index].Name + '\' and in is brothers';
        }
        let name = node.Members[index].Name;
        node.Members.splice(index, 1, ...node.Members[index].Members);
        DB2_1.DB2.writeFile('Groups');
        return 'succeeded! group \'' + name + '\' deleted!!!';
    }
    for (let item of node.Members) {
        if (MainHelpers_1.GetType(item) === 'user')
            break;
        let res = _DeleteGroupItem(id, parentId, item);
        if (res === 'succeeded')
            return res;
        else if (res != '')
            return res;
    }
    return res;
}
function _DeleteGroupDirectSon(id, parentId) {
    let index = DB2_1.DB2.Groups.findIndex(item => item.Id === id && MainHelpers_1.GetType(item) === 'group');
    if (index === -1)
        return 'failed! item selected not found';
    if (DB2_1.DB2.Groups[index].Members.length === 0 || MainHelpers_1.GetType(DB2_1.DB2.Groups[index].Members[0]) === 'user') {
        DB2_1.DB2.Groups.splice(index, 1);
        return DB2_1.DB2.writeFile('Groups');
    }
    for (let elem of DB2_1.DB2.Groups[index].Members) {
        let indexName = DB2_1.DB2.Groups.findIndex(item => item.Name === elem.Name && MainHelpers_1.GetType(item) === 'group' && item.Name !== DB2_1.DB2.Groups[index].Name);
        if (indexName > -1)
            return 'failed! same name in one of members in \'' + DB2_1.DB2.Groups[index].Name + '\' and in is brothers';
    }
    let name = DB2_1.DB2.Groups[index].Name;
    DB2_1.DB2.Groups.splice(index, 1, ...DB2_1.DB2.Groups[index].Members);
    DB2_1.DB2.writeFile('Groups');
    return 'succeeded! group \'' + name + '\' deleted';
}
function FlatteningGroup(id, parentId) {
    return new Promise((resolve) => {
        const result = _FlatteningGroup(id, parentId);
        resolve(result);
    });
}
exports.FlatteningGroup = FlatteningGroup;
function _FlatteningGroup(id, parentId) {
    let name = DB2_1.DB2.Groups.find(item => item.Id === id && MainHelpers_1.GetType(item) === 'group');
    for (let item of DB2_1.DB2.Groups) {
        if (_FlatteningGroupItem(id, parentId, item) === 'succeeded')
            return 'succeeded! group \'' + name + '\' flatted';
    }
    return 'failed';
}
function _FlatteningGroupItem(id, parentId, node) {
    if (node.Id === parentId) {
        node.Members = node.Members[0].Members;
        return DB2_1.DB2.writeFile('Groups');
    }
    for (let item of node.Members) {
        if (MainHelpers_1.GetType(item) === 'user')
            break;
        let res = _FlatteningGroupItem(id, parentId, item);
        if (res === 'succeeded')
            return res;
    }
    return 'failed';
}
function AddUserToExistingGroup(userName, parentId) {
    return new Promise((resolve) => {
        let result = '';
        let user = DB2_1.DB2.Users.find(item => item.Name === userName);
        if (!user)
            result = 'failed! user \'' + userName + '\' not exist';
        else
            result = _AddUserToExistingGroup(user, parentId);
        resolve(result);
    });
}
exports.AddUserToExistingGroup = AddUserToExistingGroup;
function _AddUserToExistingGroup(user, parentId) {
    let res = '';
    for (let item of DB2_1.DB2.Groups) {
        res = _AddUserToExistingGroupItem(user, item, parentId);
        if (res === 'succeeded')
            return 'succeeded! user \'' + user.Name + '\' added to group';
        else if (res !== '')
            return res;
    }
    return 'failed';
}
function _AddUserToExistingGroupItem(user, node, parentId) {
    let res = '';
    if (node.Id === parentId) {
        if (node.Members.find(item => item.Name === user.Name && MainHelpers_1.GetType(item) === 'user')) {
            return 'failed! user \'' + user.Name + '\' already exist';
        }
        node.Members.push(user);
        return DB2_1.DB2.writeFile('Groups');
    }
    for (let item of node.Members) {
        if (MainHelpers_1.GetType(item) === 'user')
            break;
        let res = _AddUserToExistingGroupItem(user, item, parentId);
        if (res === 'succeeded')
            return res;
        else if (res !== '')
            return res;
    }
    return res;
}
function DeleteUserFromGroup(userId, parentId) {
    return new Promise((resolve) => {
        const user = DB2_1.DB2.Users.find(item => item.Id === userId);
        const result = _DeleteUserFromGroup(user.Name, parentId);
        resolve(result);
    });
}
exports.DeleteUserFromGroup = DeleteUserFromGroup;
function _DeleteUserFromGroup(userName, parentId) {
    for (let item of DB2_1.DB2.Groups) {
        if (_DeleteUserFromGroupItem(userName, parentId, item) === 'succeeded')
            return 'succeeded! user \'' + userName + '\' deleted from group';
    }
    return 'failed';
}
function _DeleteUserFromGroupItem(userName, parentId, node) {
    if (node.Id === parentId) {
        let index = node.Members.findIndex(item => item.Name === userName && MainHelpers_1.GetType(item) === 'user');
        if (index === -1) {
            return 'failed';
        }
        node.Members.splice(index, 1);
        return DB2_1.DB2.writeFile('Groups');
    }
    for (let item of node.Members) {
        if (MainHelpers_1.GetType(item) === 'user')
            break;
        let res = _DeleteUserFromGroupItem(userName, parentId, item);
        if (res === 'succeeded')
            return res;
    }
    return 'failed';
}
//# sourceMappingURL=GroupsService.js.map