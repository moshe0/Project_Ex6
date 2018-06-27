
class User {
    constructor(_Id, _Name, _Age, _Password) {
        this.Id = _Id;
        this.Name = _Name;
        this.Age = _Age;
        this.Password = _Password;

    }
}

let Users = [
    new User(1,'Moshe', '11', 11 ),
    new User(2,'Raz', '22', 22 ),
    new User(3,'Yosef', '33', 33 ),
    new User(4,'Tommy', '44,', 44 ),
    new User(5,'Udi', '55', 55 ),
    new User(6,'Ori', '66', 66 ),
    new User(7,'Roni', '77', 77 )
];


let index = Users.findIndex(item => item.Name === 'Mosdsshe');
console.log(index === 'undefined');



