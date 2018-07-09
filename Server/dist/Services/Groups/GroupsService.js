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
const DB_1 = require("../../DB/DB");
function GetGroups() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Select the last groups
            let result = yield yield DB_1.DB.AnyQuery(`SELECT endG.id Id, endG.name Name, null Members, endG.parent_id ParentId
                 FROM
                 	(SELECT id , name, null Members, parent_id
                 	FROM groups g1 
                 	WHERE NOT EXISTS (SELECT * FROM groups g2 WHERE g1.id = g2.parent_id)) endG
                 WHERE endG.parent_id IS NULL OR endG.id not in 
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
            for (let i = 0; i < result.length - 1; i++) {
                for (let j = i + 1; j < result.length; j++) {
                    if (result[i].Id === result[j].Id) {
                        BuildTreeHelper(result[i], result[j]);
                        result.splice(j, 1);
                        --j;
                    }
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
        if (parentId === -1)
            parentId = null;
        result = _DeleteGroup(id, parentId);
        resolve(result);
    });
}
exports.DeleteGroup = DeleteGroup;
function _DeleteGroup(id, parentId) {
    return __awaiter(this, void 0, void 0, function* () {
        let count = yield DB_1.DB.AnyQuery(DB_1.DB.select('COUNT(*) count', 'members', { field: 'host_id', value: id }));
        let deleteGroup = yield DB_1.DB.AnyQuery(DB_1.DB.select('name, parent_id', 'groups', { field: 'id', value: id }));
        // if children are users
        if (count[0].count > 0) {
            yield DB_1.DB.AnyQuery(DB_1.DB.delete('members', { field: 'host_id', value: id }));
            yield DB_1.DB.AnyQuery(DB_1.DB.delete('groups', { field: 'id', value: id }));
            return `succeeded! group '${deleteGroup[0].name}' deleted`;
        }
        // if children are groups
        let children = yield DB_1.DB.AnyQuery(DB_1.DB.select('*', 'groups', { field: 'parent_id', value: id }));
        // take deleteGroup children
        if (children.length === 0) {
            yield DB_1.DB.AnyQuery(DB_1.DB.delete('groups', { field: 'id', value: id }));
            return `succeeded! group '${deleteGroup[0].name}' deleted`;
        }
        for (let item of children) {
            let brothers = yield DB_1.DB.AnyQuery(DB_1.DB.select('COUNT(*) count', 'groups', { field: 'parent_id', value: parentId }, { field: 'name', value: item.name }));
            if (brothers[0].count > 0)
                return `failed! same name in one of members in '${deleteGroup[0].name}' and in is brothers`;
        }
        yield DB_1.DB.AnyQuery(DB_1.DB.update('groups', { field: 'parent_id', value: id }, { field: 'parent_id', value: parentId }));
        yield DB_1.DB.AnyQuery(DB_1.DB.delete('groups', { field: 'id', value: id }));
        return `succeeded! group '${deleteGroup[0].name}' deleted`;
    });
}
function FlatteningGroup(id, parentId) {
    return new Promise((resolve) => {
        let result;
        result = _FlatteningGroup(id, parentId);
        resolve(result);
    });
}
exports.FlatteningGroup = FlatteningGroup;
function _FlatteningGroup(id, parentId) {
    return __awaiter(this, void 0, void 0, function* () {
        let name = yield DB_1.DB.AnyQuery(DB_1.DB.select('name', 'groups', { field: 'id', value: id }));
        yield DB_1.DB.AnyQuery(DB_1.DB.delete('groups', { field: 'id', value: id }));
        yield DB_1.DB.AnyQuery(DB_1.DB.update('members', { field: 'host_id', value: id }, { field: 'host_id', value: parentId }));
        return `succeeded! group '${name[0].name}' flatted`;
    });
}
function AddUserToExistingGroup(userName, parentId) {
    return new Promise((resolve) => {
        let result;
        result = _AddUserToExistingGroup(userName, parentId);
        resolve(result);
    });
}
exports.AddUserToExistingGroup = AddUserToExistingGroup;
function _AddUserToExistingGroup(userName, parentId) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield DB_1.DB.AnyQuery(DB_1.DB.select('*', 'users', { field: 'name', value: userName }), true);
        if (!user)
            return `failed! user '${userName}' not exist`;
        let count = yield DB_1.DB.AnyQuery(DB_1.DB.select('count(*) count', 'members', { field: 'host_id', value: parentId }, { field: 'user_id', value: user.id }), true);
        if (count.count > 0)
            return `failed! user '${userName}' already exist`;
        yield DB_1.DB.AnyQuery(DB_1.DB.insert('members (host_id, user_id)', parentId, user.id));
        return `succeeded! user '${userName}' added to group`;
    });
}
function DeleteUserFromGroup(userId, parentId) {
    return new Promise((resolve) => {
        const result = _DeleteUserFromGroup(userId, parentId);
        resolve(result);
    });
}
exports.DeleteUserFromGroup = DeleteUserFromGroup;
function _DeleteUserFromGroup(userId, parentId) {
    return __awaiter(this, void 0, void 0, function* () {
        let user = yield DB_1.DB.AnyQuery(DB_1.DB.select('*', 'users', { field: 'id', value: userId }), true);
        if (!user)
            return `failed! user '${user.name}' not exist`;
        yield DB_1.DB.AnyQuery(DB_1.DB.delete('members', { field: 'host_id', value: parentId }, { field: 'user_id', value: userId }));
        return `succeeded! user '${user.name}' deleted from group`;
    });
}
//# sourceMappingURL=GroupsService.js.map