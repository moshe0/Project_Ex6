import * as fs from 'fs';
import {Group} from "../Models/Group";
import {GetType} from "../Helpers/MainHelpers";
let db = require('./connection')();


class DataBase {
    public Users : any[];
    public Groups : Group[];
    public Messages : any[];

    constructor() {
        this.readData('users');
        this.Users = this.readFile("Users");
        this.Groups = this.readFile("Groups");
        this.Messages = this.readFile("Messages");
    }



    readData(dataName: string) {
        let query = 'SELECT * FROM ';
        query = query + dataName;
        db.query(query, (err, results) => {
            switch (dataName) {
                case 'users':
                    DB.Users = results;
                    break;
                case 'groups':
                    DB.Groups = results;
                    break;
                case 'messages':
                    DB.Messages = results;
                    break;
            }

        });
    }

















    readFile(fileName: string) {
        const data = fs.readFileSync(`${__dirname}\\${fileName}Data.json`).toString();
        if(fileName != "Groups")
            return JSON.parse(data);
        return this.GetGroupsWithFullUser(JSON.parse(data));
    }

    writeFile(fileName: string) : string {
        switch (fileName) {
            case 'Users':
                fs.writeFile(`${__dirname}\\${fileName}Data.json`, JSON.stringify(this.Users), function(err) {
                    if (!!err)
                        return "failed";
                        // res.send("failed");
                    else
                        return "succeeded";
                        // res.send("succeeded");
                });
            break;
            case 'Groups':
                this.Groups = this.GetGroupsWithOnlyIdOfUser(this.Groups);
                fs.writeFile(`${__dirname}\\${fileName}Data.json`, JSON.stringify(this.Groups), function(err) {
                    if (!!err)
                        return "failed";
                    // res.send("failed");
                    else
                        return "succeeded";
                    // res.send("succeeded");
                });
                this.Groups = this.GetGroupsWithFullUser(this.Groups);
                break;
            case 'Messages':
                fs.writeFile(`${__dirname}\\${fileName}Data.json`, JSON.stringify(this.Messages), function(err) {
                    if (!!err)
                        return "failed";
                    // res.send("failed");
                    else
                        return "succeeded";
                    // res.send("succeeded");
                });
                break;
        }
        return "succeeded";
    }


    GetGroupsWithOnlyIdOfUser (obj : Group[]){
        for(let item of obj){
            this._GetGroupsWithOnlyIdOfUser(item);
        }
        return obj;
    }
    _GetGroupsWithOnlyIdOfUser (obj : Group){
        for(let i=0 ; i<obj.Members.length ; i++) {
            if(GetType(obj.Members[i]) === 'user') {
                let index = this.Users.findIndex(user => user.Id === obj.Members[i].Id);
                if(index === -1)
                    obj.Members.splice(i--, 1);
                else
                    obj.Members[i] = {"Id" : this.Users[index].Id};
            }
            else
                this._GetGroupsWithOnlyIdOfUser(obj.Members[i]);
        }
        return obj;
    }

    GetGroupsWithFullUser(obj : Group[]){
        for(let item of obj){
            this._GetGroupsWithFullUser(item);
        }
        return obj;
    }
    _GetGroupsWithFullUser(obj : Group){
        for(let i=0 ; i<obj.Members.length ; i++) {
            if(GetType(obj.Members[i]) === 'user') {
                let index = this.Users.findIndex(user => user.Id === obj.Members[i].Id);
                if(index === -1)
                    obj.Members.splice(i--, 1);
                else
                    obj.Members[i] = Object.assign({}, this.Users[index]);
            }
            else
                this._GetGroupsWithFullUser(obj.Members[i]);
        }
        return obj;
    }
}

export const DB = new DataBase();