const db = require('mysql');

let conn;

function initConnection() {
    conn = db.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123123',
        database: 'chat'
    });

    conn.connect();
}

module.exports = ()=>{
    if(!conn){
        initConnection();
    }

    return conn;
};