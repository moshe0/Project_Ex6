"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DB2_1 = require("../../DB/DB2");
const MainHelpers_1 = require("../../Helpers/MainHelpers");
const DB_1 = require("../../DB/DB");
function GetGroups() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Select the last groups
            let result = yield yield DB_1.DB.AnyQuery(`SELECT aa1.id Id, aa1.name Name, null Members, aa1.parent_id ParentId
                 FROM
                 	(SELECT id , name, null Members, parent_id
                 	FROM groups g1 
                 	WHERE NOT EXISTS (SELECT * FROM groups g2 WHERE g1.id = g2.parent_id)) aa1
                 WHERE aa1.parent_id IS NULL OR aa1.parent_id not in 
                 	(SELECT parent_id
                 	FROM groups g3
                 	WHERE g3.parent_id IS NOT NULL AND EXISTS (SELECT * FROM groups g4 WHERE g3.id = g4.parent_id))`);
            // Find the user associated to them
            for (let i = 0; i < result.length; i++) {
                result[i].Members = [];
                let members = yield DB_1.DB.AnyQuery(DB_1.DB.select('*', 'members', { field: 'host_id', value: result[i].Id }));
                for (let item of members) {
                    result[i].Members.push(yield DB_1.DB.AnyQuery(DB_1.DB.select('id Id, name Name, password Password, age Age', 'users', { field: 'id', value: item.user_id }), true));
                }
            }
            // Build the tree
            for (let i = 0; i < result.length; i++) {
                if (!!result[i].ParentId) {
                    result.splice(i, 0, yield DB_1.DB.AnyQuery(DB_1.DB.select('id Id, name Name, null Members, parent_id ParentId', 'groups', { field: 'id', value: result[i].ParentId }), true));
                    result[i].Members = [];
                    let children = yield DB_1.DB.AnyQuery(DB_1.DB.select('id Id, name Name, null Members, parent_id ParentId', 'groups', { field: 'parent_id', value: result[i + 1].ParentId }));
                    for (let j = 0; j < children.length; j++) {
                        children[j].Members = [];
                    }
                    let index;
                    for (let j = 0; j < children.length; j++) {
                        index = result.findIndex(val => val.Id === children[j].Id);
                        if (index !== -1) {
                            children[j] = Object.assign({}, result[index]);
                            result.splice(index, 1);
                        }
                        result[i].Members.push(children[j]);
                    }
                    --i;
                }
            }
            //union tree nodes
            for (let i = 0; i < result.length - 1; i++)
                for (let j = i + 1; j < result.length; j++) {
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
            console.log(">>>>>>>>>>>. ERROR", e);
        }
    });
}
exports.GetGroups = GetGroups;
function BuildTreeHelper(resultA, resultB) {
    for (let i = 0; i < resultA.Members.length; i++) {
        if (resultA.Members[i].Members.length < resultB.Members[i].Members.length) {
            resultA.Members[i] = resultB.Members[i];
            return true;
        }
    }
    for (let i = 0; i < resultA.Members.length; i++) {
        if (BuildTreeHelper(resultA.Members[i], resultB.Members[i]) === true)
            return true;
    }
    return false;
}
function AddGroup(group, newGroupName, parentId) {
    return new Promise((resolve) => {
        let result;
        if (parentId === -1)
            result = _AddGroupDirectSon(group, parentId);
        else
            result = _AddGroup(group, newGroupName, parentId);
        resolve(result);
    });
}
exports.AddGroup = AddGroup;
function _AddGroup(group, newGroupName, parentId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (newGroupName === group.Name && newGroupName !== '')
            return `failed! 'Name' and 'New group name' must be diffrent`;
        let count = yield DB_1.DB.AnyQuery(DB_1.DB.select('COUNT(*) count, name', 'groups', { field: 'parent_id', value: parentId }, { field: 'name', value: group.Name }));
        if (count[0].count > 0)
            return `The group '${group.Name}' already exist`;
        if (newGroupName === '') {
            yield DB_1.DB.AnyQuery(DB_1.DB.insert('groups (name, parent_id)', group.Name, parentId));
            return `succeeded! group '${group.Name}' added`;
        }
        else {
            let count = yield DB_1.DB.AnyQuery(DB_1.DB.select('COUNT(*) count, name', 'groups', { field: 'parent_id', value: parentId }, { field: 'name', value: newGroupName }));
            if (count[0].count > 0)
                return `The group '${newGroupName}' already exist`;
            yield DB_1.DB.AnyQuery(DB_1.DB.insert('groups (name, parent_id)', group.Name, parentId));
            let newGroupNameObj = yield DB_1.DB.AnyQuery(DB_1.DB.insert('groups (name, parent_id)', newGroupName, parentId));
            yield DB_1.DB.AnyQuery(DB_1.DB.update('members', { field: 'host_id', value: parentId }, { field: 'host_id', value: newGroupNameObj.insertId }));
            return `succeeded! groups: '${group.Name}', '${newGroupName}' added`;
        }
    });
}
function _AddGroupDirectSon(group, parentId) {
    return __awaiter(this, void 0, void 0, function* () {
        let count = yield DB_1.DB.AnyQuery(DB_1.DB.select('COUNT(*) count, name', 'groups', { field: 'name', value: group.Name }, { field: 'parent_id', value: null }));
        if (count[0].count > 0)
            return `The group '${group.Name}' already exist`;
        yield DB_1.DB.AnyQuery(DB_1.DB.insert('groups (name)', group.Name));
        return `succeeded! group '${group.Name}' added!`;
    });
}
function DeleteGroup(id, parentId) {
    return new Promise((resolve) => {
        let result;
        result = _DeleteGroup22(id, parentId);
        // if(parentId === -1)
        //     result = _DeleteGroupDirectSon(id, parentId);
        // else
        //     result = _DeleteGroup(id, parentId);
        resolve(result);
    });
}
exports.DeleteGroup = DeleteGroup;
function _DeleteGroup22(id, parentId) {
    return __awaiter(this, void 0, void 0, function* () {
        let count = yield DB_1.DB.AnyQuery(DB_1.DB.select('COUNT(*) count', 'members', { field: 'host_id', value: id }));
        let name = yield DB_1.DB.AnyQuery(DB_1.DB.select('name', 'groups', { field: 'id', value: id }));
        // if children are users
        if (count[0].count > 0) {
            yield DB_1.DB.AnyQuery(DB_1.DB.delete('members', { field: 'host_id', value: id }));
            yield DB_1.DB.AnyQuery(DB_1.DB.delete('groups', { field: 'id', value: id }));
            return `succeeded! group '${name[0].name}' deleted`;
        }
        // if children are groups
        let children = yield DB_1.DB.AnyQuery(DB_1.DB.select('*', 'groups', { field: 'parent_id', value: id }));
        if (children.length === 0) {
            yield DB_1.DB.AnyQuery(DB_1.DB.delete('groups', { field: 'id', value: id }));
            return `succeeded! group '${name[0].name}' deleted`;
        }
    });
}
function _DeleteGroup(id, parentId) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = '';
        for (let item of DB2_1.DB2.Groups) {
            res = _DeleteGroupItem(id, parentId, item);
            if (res === 'succeeded')
                return res;
            else if (res !== '')
                return res;
        }
        return 'failed';
    });
}
function _DeleteGroupItem(id, parentId, node) {
    return __awaiter(this, void 0, void 0, function* () {
        let res = '';
        if (node.Id === parentId) {
            let index = node.Members.findIndex(item => item.Id === id && MainHelpers_1.GetType(item) === 'group');
            if (index === -1)
                return 'failed! group not found';
            if (node.Members[index].Members.length === 0 || MainHelpers_1.GetType(node.Members[index].Members[0]) === 'user') {
                let name = node.Members[index].Name;
                node.Members.splice(index, 1);
                DB2_1.DB2.writeFile('Groups');
                return `succeeded! group '${name}' deleted`;
            }
            for (let elem of node.Members[index].Members) {
                let indexName = node.Members.findIndex(item => item.Name === elem.Name && MainHelpers_1.GetType(item) === 'group' && item.Name !== node.Members[index].Name);
                if (indexName > -1)
                    return `failed! same name in one of members in '${node.Members[index].Name}' and in is brothers`;
            }
            let name = node.Members[index].Name;
            node.Members.splice(index, 1, ...node.Members[index].Members);
            DB2_1.DB2.writeFile('Groups');
            return `succeeded! group '${name}' deleted`;
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
    });
}
function _DeleteGroupDirectSon(id, parentId) {
    return __awaiter(this, void 0, void 0, function* () {
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
                return `failed! same name in one of members in '${DB2_1.DB2.Groups[index].Name}' and in is brothers`;
        }
        let name = DB2_1.DB2.Groups[index].Name;
        DB2_1.DB2.Groups.splice(index, 1, ...DB2_1.DB2.Groups[index].Members);
        DB2_1.DB2.writeFile('Groups');
        return `succeeded! group '${name}' deleted`;
    });
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
            return `succeeded! group '${name}' flatted`;
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
            result = `failed! user '${userName}' not exist`;
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
            return `succeeded! user '${user.Name}' added to group`;
        else if (res !== '')
            return res;
    }
    return 'failed';
}
function _AddUserToExistingGroupItem(user, node, parentId) {
    let res = '';
    if (node.Id === parentId) {
        if (node.Members.find(item => item.Name === user.Name && MainHelpers_1.GetType(item) === 'user')) {
            return `failed! user '${user.Name}' already exis`;
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
            return `succeeded! user '${userName}' deleted from group`;
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