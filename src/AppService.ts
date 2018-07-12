import {
    AddGroup,
    AddMessage,
    AddUser,
    AddUserToExistingGroup, DeleteGroup, DeleteUser, DeleteUserFromGroup, FlatteningGroup,
    GetGroups,
    GetMessages,
    GetSpecificUser,
    GetUsers, UpdateUser
} from "./ServiceApi";
import {User} from "./Models/User";


export class AppService {
    async GetSpecificUser(userName : string, userPassword : string) {
        try {
            const ObjUser = await GetSpecificUser(userName, userPassword);
            console.log('GetSpecificUser SUCCESSFUL');

            if(ObjUser.Id === -1){
                let user = new User(ObjUser.Id, "1", "1", 1);
                return user;
            }
            let user = new User(ObjUser.id, ObjUser.name, ObjUser.password, ObjUser.age);
            return user;
        }
        catch (e) {
            console.log('GetSpecificUser FAILED');
            return null;
        }
    }

    async GetData() {
        try {
            const ObjGroups= await GetGroups();
            const ObjUsers = await GetUsers();

            let data : any[] = [];
            data = data.concat(ObjGroups);
            data = data.concat(ObjUsers);

            console.log('GetData SUCCESSFUL');
            return data;
        }
        catch (e) {
            console.log('GetData FAILED');
            return null;
        }
    }

    async GetMessages(sender : any, receiver : any) {
        try {
            if(!sender)
                return [];
            const ObjMessages = await GetMessages(sender, receiver);

            console.log('GetMessages SUCCESSFUL');
            return ObjMessages;
        }
        catch (e) {
            console.log('GetMessages FAILED');
            return null;
        }
    }

    async AddMessage(message : any) {
        try {
            const ObjMessages = await AddMessage(message);
            console.log('AddMessage SUCCESSFUL');
            return ObjMessages;
        }
        catch (e) {
            console.log('AddMessage FAILED');
            return null;
        }
    }

    async AddUser(user : any) {
        try {
            const ObjUser= await AddUser(user);
            console.log('AddUser SUCCESSFUL');
            return ObjUser;
        }
        catch (e) {
            console.log('AddUser FAILED');
            return null;
        }
    }

    async AddGroup(group: any, newGroupName : string, parentId : number) {
        try {
            const ObjGroup = await AddGroup(group, newGroupName, parentId);
            console.log('AddGroup SUCCESSFUL');
            return ObjGroup;
        }
        catch (e) {
            console.log('AddGroup FAILED');
            return null;
        }
    }

    async AddUserToExistingGroup(userName: string, parentId : number) {
        try {
            const ObjGroup = await AddUserToExistingGroup(userName, parentId);
            console.log('AddUserToExistingGroup SUCCESSFUL');
            return ObjGroup;
        }
        catch (e) {
            console.log('AddUserToExistingGroup FAILED');
            return null;
        }
    }

    async DeleteUserFromGroup(userId: number, parentId : number) {
        try {
            const ObjGroup = await DeleteUserFromGroup(userId, parentId);
            console.log('DeleteUserFromGroup SUCCESSFUL');
            return ObjGroup;
        }
        catch (e) {
            console.log('DeleteUserFromGroup FAILED');
            return null;
        }
    }

    async FlatteningGroup(id: number, parentId : number) {
        try {
            const ObjGroup = await FlatteningGroup(id, parentId);
            console.log('FlatteningGroup SUCCESSFUL');
            return ObjGroup;
        }
        catch (e) {
            console.log('FlatteningGroup FAILED');
            return null;
        }
    }

    async DeleteGroup(id: number, parentId : number) {
        try {
            const ObjGroup = await DeleteGroup(id, parentId);
            console.log('DeleteGroup SUCCESSFUL');
            return ObjGroup;
        }
        catch (e) {
            console.log('DeleteGroup FAILED');
            return null;
        }
    }

    async UpdateUser(user : any) {
        try {
            const ObjUser= await UpdateUser(user);
            console.log('UpdateUser SUCCESSFUL');
            return ObjUser;
        }
        catch (e) {
            console.log('UpdateUser FAILED');
            return null;
        }
    }

    async DeleteUser(userId : any) {
        try {
            const ObjUser= await DeleteUser(userId);
            console.log('DeleteUser SUCCESSFUL');
            return ObjUser;
        }
        catch (e) {
            console.log('DeleteUser FAILED');
            return null;
        }
    }


}


export const appService = new AppService();