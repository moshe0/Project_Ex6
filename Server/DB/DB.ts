import * as dataBase from 'mysql';

let conn, query;

class DataBase {

    initConnection() {
        conn = dataBase.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123123',
            database: 'chat'
        });

        conn.connect();
    }

    getConnection(){
        if(!conn){
            this.initConnection();
        }

        return conn;
    }

    select(what, table, ...filters) {
        query = `SELECT ${what} FROM ${table} `;
        if (filters.length > 0){
            query += 'WHERE ';
        }
        let filtersCount = 0;
        for (const filter of filters){
            if(!filter.value)
                query +=  `${filter.field} IS ${filter.value}`;
            else if (isNaN(filter.value))
                query +=  `${filter.field} = '${filter.value}'`;
            else
                query +=  `${filter.field} = ${filter.value}`;

            if (++filtersCount < filters.length) {
                query += ' AND ';
            }
        }
        return query;
    }

    insert(table, ...values){
        query = `INSERT INTO ${table} VALUES (`;
        let valuesCount = 0;
        for (const value of values){
            if (isNaN(value)) {
                query += `'${value}'`;
            }
            else {
                query += value;
            }
            if (++valuesCount < values.length) {
                query += ', ';
            }
        }
        query += ')';
        return query;
    }

    update(table, filter, ...values){
        query = `UPDATE ${table} SET`  ;
        let valuesCount = 0;
        for (const value of values){
            if (isNaN(value.value)) {
                query += `${value.field} = '${value.value}'`;
            }
            else {
                query += `${value.field} = ${value.value}`;
            }
            query += value.field + ' = ' + value.value;

            if (++valuesCount < values.length) {
                query += ', ';
            }
        }
        if (filter){
            query +=   `WHERE ${filter.field} = ${filter.value}`;
        }
        return query;
    }
}

export const DB = new DataBase();
export const db = DB.getConnection();
